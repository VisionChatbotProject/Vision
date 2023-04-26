import sys
sys.path.append("../")
import json
import SQL_DB_utils as DB
import baseClass as Base
import argparse
import yaml

parser = argparse.ArgumentParser(description='Create NLU file in json format by extracting info from SQL DB')
parser.add_argument('-v', dest='verbose', action='store_true', help='verbose mode')
parser.add_argument('-nlu', dest='nlu', action='store', help='nlu.json file')
parser.add_argument('-responses', dest='responses', action='store', help='reponses.yml file')
args = parser.parse_args()


class Intent(Base.BaseSerializable):
    def __init__(self, intent, text):
        self.intent = f"faq/{intent}"
        self.text = text
        # self.entities = []
        # self.entities = [Entity(self.text)]


class Utterance(Base.BaseSerializable):
    def __init__(self, intent, text):
        self.intent = f"utter_faq/{intent}"
        self.text = text
        self.entities = []
        # self.entities = [Entity(self.text)]

    def get_yml(self):
        return {self.intent: [{"text": self.text}]}


def create_faq_nlu():
    intent_list = []
    faq_name, faq_question = DB.getListOfFaqQuestion()
    if faq_name is None or faq_question is None:
        raise Exception(f"{__file__} : No Records found in DB !!")

    try:
        for i in zip(faq_name, faq_question):
            if args.verbose is True:
                print(f"faq : {i}")
            intent_list.append(Intent(i[0], i[1]))

        D = {"rasa_nlu_data": {"common_examples": intent_list}}
        with open(args.nlu, "w") as fp:
            json.dump(D, fp, cls=Base.BaseSerializable, indent=4)
    except Exception as e:
        print(e)
        print(f"{args.nlu} NOT created successfully !!")
        return False

    print(f"{args.nlu} created successfully, {len(intent_list)} intents created\n")
    return True


def create_faq_response():
    utter_list = []
    faq_name, faq_answer = DB.getListOfFaqAnswer()
    if faq_name is None or faq_answer is None:
        raise Exception(f"{__file__} : No Records found in DB !!")

    try:
        for i in zip(faq_name, faq_answer):
            if args.verbose is True:
                print(f"utter_faq : {i}")
            utter_list.append(Utterance(i[0], i[1]))

        d = {}
        for i in utter_list:
            d.update(i.get_yml())

        with open(args.responses, 'w') as file:
            yaml.dump({'version': '2.0', "responses": d}, file)
    except Exception as e:
        print(e)
        print(f"{args.responses} NOT created successfully !!")
        return False

    print(f"{args.responses} created successfully, {len(utter_list)} responses created\n")

    return True


if __name__ == "__main__":
    rel_nlu = create_faq_nlu()
    ret_responses = create_faq_response()
