import sys
from dataclasses import asdict

from ruamel.yaml import YAML
from ruamel.yaml.comments import \
    CommentedMap as OrderedDict, \
    CommentedSeq as OrderedList
from ruamel.yaml.main import \
    round_trip_load as yaml_load, \
    round_trip_dump as yaml_dump
from ruamel.yaml.scalarstring import PreservedScalarString

import constants


class YamlHandler:
    def __init__(self, input_file, output_file):
        self.input_file = input_file
        self.output_file = output_file
        self.read_data_list = []

    def nlu_read(self, end_info_dict):
        yaml_dict = OrderedDict()
        intent_list = OrderedList()
        try:
            with open(file=self.input_file, mode='r', encoding='utf-8') as fil:
                doc = yaml_load(stream=fil)
                # print(doc)
                yaml_dict["version"] = doc["version"]

                for top_heading, data in doc.items():
                    # print(top_heading, data)
                    if top_heading == "nlu":
                        for intents in data:

                            # check intent == "goodbye" and examples " last value "see you later"
                            if intents["intent"].strip() == end_info_dict[0].strip() \
                                    and intents["examples"].split('-')[-1].strip() == end_info_dict[1].strip():
                                intent_list.append(intents)
                                yaml_dict["nlu"] = intent_list
                                return yaml_dict

                            intent_list.append(intents)
                yaml_dict["nlu"] = intent_list
                # print(yaml_dict)
                return yaml_dict
        except PermissionError:
            print(f'[ERROR] Can not read the file {self.input_file}')
            sys.exit()

    @staticmethod
    def join_nlu_dict_data(default_data, new_data):
        # print(new_data)
        for intent in new_data:
            intent_dict = asdict(intent)
            default_data["nlu"].append(OrderedDict([("intent", intent_dict["intent_name"]),
                                                    ("examples",
                                                     PreservedScalarString(intent_dict["examples"]))
                                                    ]
                                                   )
                                       )
        return default_data

    def nlu_data_dump(self, default_data, new_data):
        """
        writing format {'intent': 'test_first_definition',
                        'examples': '- Definition of music\n
                                    - What is the definition of music? whole definition \n
                                    - The definition music'}
        :return:
        """
        join_data = self.join_nlu_dict_data(default_data=default_data, new_data=new_data)

        with open(file=self.output_file, mode='w', encoding='utf-8') as fil:
            yaml = YAML()
            yaml.preserve_quotes = True
            yaml.default_flow_style = False
            yaml_dump(data=join_data, stream=fil)

        print('[INFO] nlu.yml file is updated')

    # ----------------------------------------------------------------------------------------------------------------
    def rules_read(self, end_info_dict):
        """
        """
        yaml_dict = OrderedDict()
        try:
            with open(file=self.input_file, mode='r', encoding='utf-8') as fil:
                doc = yaml_load(stream=fil)
                yaml_dict["version"] = doc["version"]
                yaml_dict["rules"] = OrderedList()
                for top_heading, data in doc.items():

                    if top_heading == "rules":
                        for rule in data:

                            # check rule == " Say goodbye anytime the user says goodbye"
                            # and action  last value "utter_goodbye"
                            if rule["rule"].strip() == end_info_dict[0].strip() \
                                    and rule["steps"][1]['action'].strip() == end_info_dict[1].strip():
                                yaml_dict["rules"].append(rule)
                                return yaml_dict

                            yaml_dict["rules"].append(rule)

                return yaml_dict
        except PermissionError:
            print(f'[ERROR] Can not read the file {self.input_file}')
            sys.exit()

    @staticmethod
    def join_rules_dict_data(default_data, new_data):
        for rule in new_data:
            rule_dict = asdict(rule)

            # adding '-' before intent and action
            step_list = OrderedList()
            for k, v in rule_dict['steps'].items():
                step_list.append({k: v})
            default_data["rules"].append(OrderedDict([("rule", rule_dict["rule"]),
                                                      ("steps", step_list)
                                                      ]))
        return default_data

    def rules_data_dump(self, default_data, new_data):
        """
        writing format {'intent': 'test_first_definition',
                        'examples': '- Definition of music\n
                                    - What is the definition of music? whole definition \n
                                    - The definition music'}
        :return:
        """
        join_data = self.join_rules_dict_data(default_data=default_data, new_data=new_data)
        with open(file=self.output_file, mode='w', encoding='utf-8') as fil:
            yaml_dump(data=join_data, stream=fil)

        print('[INFO] rules.yml file is updated')

    # ----------------------------------------------------------------------------------------------------------------
    def domain_read(self):
        keep_section = 'utter_goodbye'
        try:
            with open(file=self.input_file, mode='r', encoding='utf-8') as fil:
                doc = yaml_load(stream=fil, preserve_quotes=True)

                # clean up intent section
                # remove all the values after (- greet, - goodbye) from the intents
                goodbye_index = list(doc['intents']).index('goodbye') + 1
                doc['intents'] = doc['intents'][:goodbye_index]  # all the value before - goodbye

                # get index of the utter_goodbye
                responses_list = list(doc['responses'])
                index_utter_goodbye = responses_list.index(keep_section) + 1
                delete_items = responses_list[index_utter_goodbye:]
                for item in delete_items:
                    doc['responses'].pop(item)

                return doc
        except PermissionError:
            print(f'[ERROR] Can not read the file {self.input_file}')
            sys.exit()

    def append_move_comment(self, l, e):
        """
        https://stackoverflow.com/questions/42172399/modifying-yaml-using-ruamel-yaml-adds-extra-new-lines
        :param l:
        :param e:
        :return:
        """
        i = len(l) - 1
        l.append(e)
        x = l.ca.items[i][0]  # the end comment
        if x is None:
            return
        l.ca.items[i][0] = None
        l.ca.items[i + 1] = [x, None, None, None]

    def join_domain_dict_data(self, default_data, new_data):
        default_data['intents'].extend(new_data.intents)
        for response in new_data.responses:
            default_data['responses'].update(response)
        return default_data

    def domain_data_dump(self, default_data, new_data):
        join_data = self.join_domain_dict_data(default_data=default_data, new_data=new_data)

        with open(file=self.output_file, mode='w', encoding='utf-8') as fil:
            yaml = YAML()
            # yaml.indent(mapping=4, sequence=3, offset=3)
            yaml.dump(data=join_data, stream=fil)
            # yaml_dump(data=join_data, stream=fil)

        print('[INFO] domain.yml file is updated')


if __name__ == '__main__':
    yml = YamlHandler(input_file=constants.NLU_FILE_PATH, output_file=constants.NLU_FILE_PATH)
    my_list = yml.nlu_read(end_info_dict=constants.END_NLU_YML_TUPLE)
