import sys
from django.db import models
from django.conf import settings
from django.http import HttpResponse
from django.utils import timezone

from rest_framework import status

import logging
import requests
import json

logger = logging.getLogger(__name__)


class SynchronizationDefinition():

    def __init__(self, entity):
        self.entity = entity


class AbstractSynchronizableBase(models.Model):

    class SynchronizationPolicy(models.IntegerChoices):
        EAGER = 1, 'Synchronize on every save',
        EAGER_ASYNC = 2, 'Synchronize on every save, async'
        ON_DEMAND = 3, 'Synchronize only on external trigger'

    external_id = models.BigIntegerField(
        blank=True,
        null=True,
        help_text='Specifies the id on the remote server',
    )

    last_synchronized = models.DateTimeField(
        null=True,
        help_text='The last synchronization date for this model'
    )

    synchronization_policy = models.PositiveSmallIntegerField(
        choices=SynchronizationPolicy.choices,
        default=SynchronizationPolicy.EAGER,
        help_text='Defines the synchronization policy for this model'
    )

    TIMEOUT = 0.5

    def save(self, *args, **kwargs):
        if self.synchronization_policy != AbstractSynchronizableBase.SynchronizationPolicy.EAGER:
            raise Exception('Currently, only Eager synchronization is supported')

        sync = kwargs.pop('sync', True)
        super().save(*args, **kwargs)

        if sys.argv[1:2] == ['test']:
            return

        if sync and getattr(settings, 'ENABLE_SYNC', True) is True:
            self.synchronize()

    def delete(self):
        if getattr(settings, 'ENABLE_SYNC', True) is True:
            try:
                self._delete_from_remote()
            except Exception as e:
                logger.error(f'Could not remove entity from remote, reason: {str(e)}')

        super().delete()

    def synchronize(self):
        definition = self._get_synchonization_definition()
        if not definition:
            return  # so that nothing breaks, this should be removed once sync is enabled on all entities.

        base_url = f'{settings.ACTIVE_BOTAPI_URL}/{definition.entity}'

        logger.info(f'Checking if entity {str(self.__class__)} {str(self.id)} exists on remote')
        if self._exists_on_remote(base_url, definition):
            logger.debug(f'Updating entity {str(self.__class__)} {str(self.id)} on remote')
            result = self._update_on_remote(base_url, definition)
        else:
            logger.debug(f'Inserting entity {str(self.__class__)} {str(self.id)} on remote')
            result = self._add_on_remote(base_url, definition)

        if result:
            self.last_synchronized = timezone.now()
            self.save(sync=False)
            logger.debug(f'Sync for {str(self.__class__)} {str(self.id)} succeeded')

    def _exists_on_remote(self, base_url, definition):
        if self.external_id is None:
            return False

        retrieve_url = f'{base_url}/get'

        # This is apparently broken, so we have to retrieve all entities and parse them manually.
        # And who puts data in a GET anyway?
        # data = {'ids': [self.external_id]} <- use this once retrieval by id works properly.

        # gracefully timeout if app is not available
        try:
            result = requests.get(retrieve_url, data={}, timeout=self.TIMEOUT, verify=not settings.DEBUG)
        except:
            return False

        if result.status_code == status.HTTP_200_OK:
            response = json.loads(result.content)[f'{definition.entity}s']
            for entity in response:
                if entity.get(f'id_{definition.entity}', None) == self.external_id:
                    return True

        return False

    def _update_on_remote(self, base_url, definition):
        payload = self._get_payload()
        payload[f'id_{definition.entity}'] = self.external_id

        add_url = f'{base_url}/edit'

        # Beware, contrary to common belief, a PUT does not require (and therefore not update)
        # all fields on _this_ remote API. For intents, "is_quiz" is ignored...

        # gracefully timeout if app is not available
        try:
            result = requests.put(add_url, data=payload, timeout=self.TIMEOUT, verify=not settings.DEBUG)
        except:
            return False


        if result.status_code == status.HTTP_200_OK:
            response = json.loads(result.content)
            if response.get('success', False):
                return True
            else:
                logger.error(f'Update for {str(self)} failed, reason: {result.content}')
                return False

    def _add_on_remote(self, base_url, definition):
        payload = self._get_payload()

        add_url = f'{base_url}/add'

        # gracefully timeout if app is not available
        try:
            result = requests.post(add_url, data=payload, timeout=self.TIMEOUT, verify=not settings.DEBUG)
        except:
            return False

        # should be "201" but adhering to standards is apparently a no-go
        if result.status_code == status.HTTP_200_OK:
            response = json.loads(result.content)
            if response.get('success', False):
                self.external_id = response['id']
                return True
            else:
                logger.error(f'Insert for {str(self)} failed, reason: {result.content}')
                return False

    def _delete_from_remote(self):
        definition = self._get_synchonization_definition()
        if not definition:
            return  # so that nothing breaks, this should be removed once sync is enabled on all entities.

        if self.external_id is None:
            return  # nothing to do here.

        delete_url = f'{settings.ACTIVE_BOTAPI_URL}/{definition.entity}/delete'
        data = {
            f'id_{definition.entity}': self.external_id
        }

        # gracefully timeout if app is not available
        try:
            result = requests.delete(delete_url, data=data, timeout = self.TIMEOUT, verify=not settings.DEBUG)
        except:
            return False


        print(str(result.content))

        # Attention, at least for intents, this call _will_ fail. Idk what happens, but luckily the remote leaks the full exception info.
        # So, here you go:
        # Traceback (most recent call last):\\n  File \\"/app/./app.py\\", line 740, in api_delete_intent\\n
        # cursor.execute(\\"delete from intent where id_intent=?\\", (str(json_body[\\"id_intent\\"])))\\nsqlite3.ProgrammingError:
        #   Incorrect number of bindings supplied. The current statement uses 1, and there are 3 supplied.\\n"}\n
        if result.status_code == status.HTTP_200_OK and json.loads(result.content).get('success', False):
            return True
        else:
            logger.error(f'Delete for {str(self)} failed, reason: {str(result.content)}')

    def _get_synchonization_definition(self):
        return None  # this should be made to throw if not overridden.

    class Meta:
        abstract = True
