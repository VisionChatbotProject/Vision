"""
required models to easily get data in proper manner
"""
from dataclasses import dataclass

from ruamel.yaml.comments import \
    CommentedMap as OrderedDict, \
    CommentedSeq as OrderedList


@dataclass
class Topic:
    # intent_id: int
    intent_name: str
    examples: str


@dataclass
class Steps:
    intent: str
    action: str


@dataclass
class Rule:
    # intent_id: int
    rule: str
    steps: Steps


@dataclass
class Domain:
    intents: OrderedList
    responses: OrderedList
