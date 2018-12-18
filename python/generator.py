#!/usr/bin/python3

import json
import random
import re
import uuid
import pymysql
from fuzzywuzzy import fuzz
from functools import reduce
from markov import fetch_games


def choose_letter(s):
    r = random.random()
    p = probs[s]
    i = min([i for i, x in enumerate([r < l for l in list(p.values())]) if x])
    return list(p.keys())[i]


def gen_title(title, n):
    keep_going = True
    while keep_going:
        if title[-n:] == "`"*n:
            keep_going = False
        else:
            title = title + choose_letter(title[-n:])
    return title[n:-n]


def check_name(name, known, generated):
    result = False
    if name.__len__() > 30:
        result = True
    if name in known:
        result = True
    if any([True for k in known if re.search(name, k)]):
        result = True
    if name in generated:
        result = True
    if any([fuzz.partial_ratio(name.lower(), k.lower())==90 for k in known]):
        result = True
    if any([fuzz.partial_ratio(k.lower(), name.lower())==90 for k in known]):
        result = True
    if any([fuzz.partial_ratio(name.lower(), k.lower())>=60 for k in generated]):
        result = True
    if re.findall(":+",name).__len__() > 1 or re.findall("\?+",name).__len__() > 1:
        result = True
    if re.findall("-$",name).__len__() == 1:
        result = True
    return result


def write_to_mysql(game, method, db):
    cursor = db.cursor()
    sql = """INSERT INTO fake_games
            (game_id, game, method)
            VALUES ('{}','{}','{}');"""
    try:
        cursor.execute(sql.format(uuid.uuid4(), game, method))
        db.commit()
    except:
        print("SOMETHING HAPPENED! "+game)
        db.rollback()


if __name__ == "__main__":
    with open('../nodejs/src/mysql.json') as f:
        mysql_conn = json.load(f)
    known_games = fetch_games(mysql_conn)
    db = pymysql.connect(mysql_conn['host'], 
                         mysql_conn['user'], 
                         mysql_conn['password'], 
                         mysql_conn['database'])
    
    memory_length = 4

    with open('markov_probabilities_{}.json'.format(str(memory_length))) as jsonfile:
        probs = json.load(jsonfile)

    start = '*' * memory_length
    fake_game_list = ['']
    while fake_game_list.__len__() < 1000:
        go = True
        out = ""
        while go:
            seed = reduce(lambda a, b: a+b,random.sample(known_games,10))
            random.seed(seed)
            out = gen_title(start, memory_length)
            if check_name(out, known_games, fake_game_list):
                go = True
            else:
                go = False
        fake_game_list.append(out)
        write_to_mysql(out, 'markov, len {} memory'.format(memory_length), db)
        print(out)
