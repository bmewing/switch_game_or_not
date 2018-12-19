#!/usr/bin/python3

import pymysql
from collections import Counter
from functools import reduce
import re
import json


def parse_name(name, n, nl):
    name = "*"*n+name+"`"*n
    l = name.__len__()-n
    for i in range(l):
        try:
            nl[name[i:(i+n)]].append(name[i+n])
        except KeyError:
            nl[name[i:(i+n)]] = [name[i+n]]
    return nl


def calc_percent(n):
    ct = dict(Counter(n))
    p = [v / sum(ct.values()) for v in ct.values()]
    cp = reduce(lambda c, x: c+[c[-1] + x], p, [0])[1:]
    ky = list(ct.keys())
    output = {}
    for ir in range(cp.__len__()):
        output[ky[ir]] = cp[ir]
    return output


def fetch_games(conn):
    db = pymysql.connect(conn['host'], conn['user'], conn['password'], conn['database'])
    cursor = db.cursor()
    sql = "SELECT game FROM games;"
    known = []
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        known = [r[0] for r in results]
    except:
        print("Error, unable to fetch data")
    return known


def gen_markov(known, n):
    next_letter = {}
    for k in known:
        k = re.sub("[\*\(\)]", "", k)
        next_letter = parse_name(k, n, next_letter)

    for i in next_letter.keys():
        next_letter[i] = calc_percent(next_letter[i])

    with open("markov_probabilities_{}.json".format(str(n)), 'w') as outfile:
        json.dump(next_letter, outfile, indent=4, sort_keys=True)
    return 0


with open('../nodejs/mysql.json') as f:
    mysql_conn = json.load(f)

known_games = fetch_games(mysql_conn['writer'])
_ = gen_markov(known_games, 3)
_ = gen_markov(known_games, 4)

