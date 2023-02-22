"""
1. query all the data from database
"""

import re
import sqlite3

from ruamel.yaml.comments import \
    CommentedMap as OrderedDict, \
    CommentedSeq as OrderedList
from ruamel.yaml.scalarstring import DoubleQuotedScalarString

from models import Topic, Rule, Steps, Domain
import os


class IntentsQuery:
    """
    context manager Sqlite class to commit everything and exit safely
    """

    def __init__(self, database_name: str = ''):
        database = os.environ.get('DATABASE')
        self.db = database

    def __enter__(self):
        self.con = sqlite3.connect(self.db)
        self.cursor = self.con.cursor()
        return self

    def query_table(self):
        return self.con.execute('''SELECT * FROM intent''').fetchall()

    def get_intents(self):
        """
        Get all the intent from the query and clean up the values
        :return: list[Topic]
        """
        print(f'[INFO] database path {self.db}')
        intents_list = self.query_table()
        topic_list = []
        rules_list = []
        responses_list = OrderedList()
        intents_list_for_domain = OrderedList()
        for intent in intents_list:
            # clean up the topic info
            # intent_id = intent[0]

            # replacing space with '_'
            intent_name = re.sub('[^a-zA-Z0-9_?\S]', '_', str(intent[1]))
            example = re.sub('[^a-zA-Z0-9-?\n\f]', ' ', str(intent[2]))

            # replace multiple spaces with single space
            example = re.sub(' +', ' ', example)

            # if at beginning of sentence '-' does not exist then add it
            if example[0] != '-':
                example = '- ' + example

            # adding '-' other places
            new_intents = example.split('\n')
            temp_intent = ''

            # print(new_intents)
            for data in new_intents:
                # at the beginning of sentence if '-' not found then add it
                if data[0] != '-':
                    data = '- ' + data

                temp_intent += data + '\n'

            response = re.sub('[^a-zA-Z0-9-?\s]', ' ', str(intent[3]))
            intents_list_for_domain.append(intent_name)
            # create data structures
            topic = Topic(
                # intent_id=intent_id,
                intent_name=intent_name,
                examples=temp_intent,
            )

            uttr_intent_name = 'utter_' + intent_name
            rule = Rule(
                rule='rule for ' + intent_name,
                steps=Steps(intent=intent_name,
                            action=uttr_intent_name)
            )
            response_dict = OrderedDict(
                [(
                    uttr_intent_name,
                    OrderedList([OrderedDict([('text', DoubleQuotedScalarString(response.strip()))])]))])

            print(f'[INFO] filtered query {topic}, {rule}')
            topic_list.append(topic)
            rules_list.append(rule)
            responses_list.append(response_dict)
        domain = Domain(intents=intents_list_for_domain, responses=responses_list)
        return topic_list, rules_list, domain

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.con.commit()
        self.con.close()


if __name__ == '__main__':
    with IntentsQuery() as curs:
        curs.get_intents()
    # k = (6, 'first definition ?',
    #      'Definition of music\r\n- What is the definition of music?  (whole definition) \r\nThe definition /music#',
    #      '## music is the art of producing vocal or insturmental sounds')
    # t = k[3].strip()
    #
    # new = re.sub('[^a-zA-Z0-9-?]', ' ', t)
    # print(new)
