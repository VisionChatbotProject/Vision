import os
# -*- coding: utf-8 -*-
# @Time : 4/20/2022 9:44 PM
# @File : constants.py

"""
"""

data = os.environ.get('DATA')

NLU_FILE_PATH = data+f'data/nlu.yml'
END_NLU_YML_TUPLE = ('goodbye', 'see you later')

RULES_FILE_PATH = data+f'data/rules.yml'
END_RULES_YML_TUPLE = ('Say goodbye anytime the user says goodbye', 'utter_goodbye')

DOMAIN_FILE_PATH = data+f'domain.yml'
INSERT_DATA_POINT_DOMAIN_YML_TUPLE = ('utter_goodbye', "Bye")
