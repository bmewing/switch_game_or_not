#!/usr/bin/python3

import pymysql
import csv
from datetime import datetime
import json
import random
import re
import time
from os import listdir


def choose_letter(s, prbs):
    r = random.random()
    p = prbs[s]
    i = min([i for i, x in enumerate([r < l for l in list(p.values())]) if x])
    return list(p.keys())[i]


def gen_title(title, prbs, n):
    go = True
    while go:
        if title[-n:] == "`"*n:
            go = False
        else:
            title = title + choose_letter(title[-n:], prbs)
    title = re.sub("'","''",title)
    return title


with open('../nodejs/src/mysql.json') as f:
    mysql_conn = json.load(f)

db = pymysql.connect(mysql_conn['host'], mysql_conn['user'], mysql_conn['password'], mysql_conn['database'])

cursor = db.cursor()

sql = """INSERT INTO games
              (week_id,week,game,real_game,method)
              VALUES ({},'{}','{}',{},'{}');"""

to_load = [l for l in listdir('.') if re.search('switch_games_week_',l)]
for f in to_load:
    print(f)
    with open(f, newline='') as csvf:
        reader = csv.reader(csvf)
        for row in reader:
            week = datetime.strptime(row[1],'%Y-%m-%d').strftime("%b %e, %Y")
            week_id = row[2]
            title = row[0]
            title = re.sub("'","''",title)
            try:
                cursor.execute(sql.format(week_id, week, title, 1, ''))
                db.commit()
            except:
                print("SOMETHING HAPPENED! "+title)
                db.rollback()

#     for i in range(random.randint(1,2)):
#         time.sleep(3)
#         start = [k for k in list(probs3.keys()) if re.search('^\*+$',k)][0]
#         out = gen_title(start, probs3, 3)
#         title = out[3:-3]
#         try:
#               cursor.execute(sql.format(week_id, week, title, 0, '3-mem Markov Chain'))
#               db.commit()
#         except:
#               print("ERROR!!")
#               db.rollback()

#     for i in range(random.randint(1,2)):
#         time.sleep(3)
#         start = [k for k in list(probs4.keys()) if re.search('^\*+$',k)][0]
#         out = gen_title(start, probs4, 4)
#         title = out[4:-4]
#         try:
#               cursor.execute(sql.format(week_id, week, title, 0, '4-mem Markov Chain'))
#               db.commit()
#         except:
#               print("ERROR!!")
#               db.rollback()

#     for i in range(random.randint(1,2)):
#         time.sleep(3)
#         start = [k for k in list(probs5.keys()) if re.search('^\*+$',k)][0]
#         out = gen_title(start, probs5, 5)
#         title = out[5:-5]
#         try:
#               cursor.execute(sql.format(week_id, week, title, 0, '5-mem Markov Chain'))
#               db.commit()
#         except:
#               print("ERROR!!")
#               db.rollback()
db.close()