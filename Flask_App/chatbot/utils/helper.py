from logging import getLogger
from datetime import datetime as dt
import random

logger = getLogger()


def button_it(lists):
    buttons = []
    try:
        if not isinstance(lists[0], tuple):
            for i in lists:
                buttons.append(
                    {
                        "title": i,
                        "payload": i,
                    }
                )
        else:
            for i in lists:
                buttons.append({
                    "title": i[0],
                    "payload": i[1]
                })
        return buttons
    except Exception as e:
        logger.exception(e)


def shuffleQuestions(q):
    """
    This function is for shuffling
    the dictionary elements.
    """
    # random.shuffle(q)
    d = []
    for i in q:
        # shuffle the answers
        ans = []
        ans = i[1:].copy()
        random.shuffle(ans[0])
        d.append([i[0], ans[0]])

    return q, d
