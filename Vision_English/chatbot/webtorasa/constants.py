# -*- coding: utf-8 -*-
# @Time : 4/20/2022 9:44 PM
# @File : constants.py

"""
"""

NLU_FILE_PATH = f'/home/chatbot/data/nlu.yml'
END_NLU_YML_TUPLE = ('goodbye', 'see you later')

RULES_FILE_PATH = f'/home/chatbot/data/rules.yml'
END_RULES_YML_TUPLE = ('Say goodbye anytime the user says goodbye', 'utter_goodbye')

DOMAIN_FILE_PATH = f'/home/chatbot/domain.yml'
INSERT_DATA_POINT_DOMAIN_YML_TUPLE = ('utter_goodbye', "Bye")
