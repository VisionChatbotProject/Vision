from django.conf import settings
from django.utils import translation

def set_language_context(selected_language: str) -> None:
    '''
    Sets the context language. If the given language is not, the default language will be set.

            Parameters:
                    selected_language (str): A string that represents the language code
                                             to be set. For example: 'de'
    '''
    if any(selected_language in language for language in settings.LANGUAGES):
                translation.activate(selected_language)
    else:
        translation.activate(settings.LANGUAGE_CODE)
