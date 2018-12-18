#!/usr/bin/python3

import json
import random
import re
from markov import fetch_games


def choose_letter(s):
    r = random.random()
    p = probs[s]
    i = min([i for i, x in enumerate([r < l for l in list(p.values())]) if x])
    return list(p.keys())[i]


def gen_title(title, n):
    go = True
    while go:
        if title[-n:] == "`"*n:
            go = False
        else:
            title = title + choose_letter(title[-n:])
    return title[n:-n]


def check_name(name, known):
    result = False
    if name in known_games:
        result = True
    if any([True for k in known_games if re.search(name, k)]):
        result = True
    return(result)


if __name__ == "__main__":
    with open('../nodejs/src/mysql.json') as f:
        mysql_conn = json.load(f)
    known_games = fetch_games(mysql_conn)

    memory_length = 4

    with open('markov_probabilities_{}.json'.format(str(memory_length))) as jsonfile:
        probs = json.load(jsonfile)

    start = '*' * memory_length
    fake_games = []
    while fake_games.__len__() < 100:
        go = True
        while go:
            out = gen_title(start, memory_length)
            if check_name(out, known_games):
                go = True
            else:
                go = False
        fake_games.append(out)
        print(out)