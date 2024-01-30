import os
import pdb
import sys
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from django.contrib.contenttypes.models import ContentType
import logging
from django.contrib.auth.models import Group, Permission
import requests
from authoring_core.models import Organization, OrganizationMembership
from authoring_course.models.chapter import Chapter
from authoring_course.models.task import CourseTask
from authoring_questionnaire.models import Questionnaire
from authoring_questionnaire.models.answer_option import AnswerOption
from authoring_questionnaire.models.question import Question
from authoring_user.models import AuthoringUser, AuthoringPerson, AuthoringInvite
from authoring_course.models import CourseIntent, Course, CourseExam
from model_bakery import baker
from pprint import pprint
import json
import traceback

logger = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

# python manage.py seed --mode=clear

""" Clear all data and do not create any object """
MODE_CLEAR = 'clear'

class Command(BaseCommand):
  help = "seed database for testing and development."

  def add_arguments(self, parser):
    parser.add_argument('--mode', type=str, help="Mode")

  def handle(self, *args, **options):
    self.stdout.write('seeding data...')
    run_seed(self, options['mode'])
    self.stdout.write('done.')

def clear_intent_data():
  logger.info("Delete Intent instances")
  id=Course.objects.get(name="CONTESSA").id
  CourseIntent.objects.filter(course_id=id).delete()

def create_intents():
  path = os.path.join(settings.BASE_DIR,'fixtures/Intents.json')
  f = open(path)
  json_data = json.load(f)
  for r in json_data[0]['rows']:
    create_intent(r['intent_name'], r['intent_list'].split('\n'), r['response'])

def create_intent(name, intents, response):
    logger.info("Creating intent")
    intent = baker.make(CourseIntent,
      name=name,
      intents=intents,
      response=response,
      course_id=Course.objects.get(name="CONTESSA").id
    )
    logger.info("{} intent created.".format(intent.__dict__))
    return intent

def create_basic_setup():
  person = baker.make(AuthoringUser).person
  print(person)
  organization = baker.make(Organization)
  print(organization)
  member = baker.make(OrganizationMembership,
      person = person,
      organization = organization,
      role=organization.get_admin_role()
  )
  pprint(member)
  image = (
      b'\x89\x50\x4E\x47\x0D\x0A\x1A\x0A\x00\x00\x00\x0D\x49\x48\x44\x52'
      b'\x00\x00\x01\x00\x00\x00\x01\x00\x01\x03\x00\x00\x00\x66\xBC\x3A'
      b'\x25\x00\x00\x00\x03\x50\x4C\x54\x45\xB5\xD0\xD0\x63\x04\x16\xEA'
      b'\x00\x00\x00\x1F\x49\x44\x41\x54\x68\x81\xED\xC1\x01\x0D\x00\x00'
      b'\x00\xC2\xA0\xF7\x4F\x6D\x0E\x37\xA0\x00\x00\x00\x00\x00\x00\x00'
      b'\x00\xBE\x0D\x21\x00\x00\x01\x9A\x60\xE1\xD5\x00\x00\x00\x00\x49'
      b'\x45\x4E\x44\xAE\x42\x60\x82'
  )

def clear_chatbot_data():
  response = requests.get(settings.ACTIVE_BOTAPI_URL + "/cleardb", verify=not settings.DEBUG)
  logger.info("Clear bot DB: {}".format(response))

def create_chatbot_data():
  for model in [Course, CourseIntent, Chapter, CourseExam, Questionnaire, Question, AnswerOption, CourseTask]:
    logger.info("Syncing model {}".format(model._meta.object_name))
    for object in model.objects.all():
      logger.debug("Object id {}".format(object.id))
      try:
        object.save()
      except:
        logger.error("Save Object id {} {}".format(object.id, traceback.print_exc()))


def run_seed(self, mode):
  if mode == MODE_CLEAR:
      clear_chatbot_data()
      #clear_intent_data()

  if mode != MODE_CLEAR:
    #create_intents()
    create_chatbot_data()