import constants
from sql_queries import IntentsQuery
from yaml_handler import YamlHandler


def main():
    with IntentsQuery() as curs:
        topic_list, rules_list, domain_data = curs.get_intents()

    # reading nlu file
    nlu_yml = YamlHandler(input_file=constants.NLU_FILE_PATH, output_file=constants.NLU_FILE_PATH)
    nlu_default_data = nlu_yml.nlu_read(end_info_dict=constants.END_NLU_YML_TUPLE)
    nlu_yml.nlu_data_dump(default_data=nlu_default_data, new_data=topic_list)

    # reading rules file
    rules_yml = YamlHandler(input_file=constants.RULES_FILE_PATH, output_file=constants.RULES_FILE_PATH)
    rules_default_data = rules_yml.rules_read(end_info_dict=constants.END_RULES_YML_TUPLE)
    rules_yml.rules_data_dump(default_data=rules_default_data, new_data=rules_list)

    # reading domain file
    domain_yml = YamlHandler(input_file=constants.DOMAIN_FILE_PATH, output_file=constants.DOMAIN_FILE_PATH)
    domain_default_data = domain_yml.domain_read()
    domain_yml.domain_data_dump(default_data=domain_default_data, new_data=domain_data)


if __name__ == '__main__':
    main()
