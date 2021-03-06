#!/usr/bin/python3

import pymysql
import requests
import json
import functools
import time
import re
import math
from datetime import datetime, date, timedelta


odate = datetime(2017, 3, 2, 0, 0)
thisweek = math.floor((datetime.today() - odate).days / 7)

with open('../nodejs/mysql.json') as f:
    mysql_conn = json.load(f)


def last_thursday(ref = date.today()):
    today = datetime.strptime(str(ref),"%Y-%m-%d")
    dow = today.weekday()
    if dow == 3:
        return today
    elif dow > 3:
        return today - timedelta(days = dow-3)
    else:
        return today - timedelta(days = dow+4)


def write_to_mysql(week_id, week, game, release, conn):
    db = pymysql.connect(conn['host'], conn['user'], conn['password'], conn['database'])
    cursor = db.cursor()
    sql = """REPLACE INTO games
            (week_id,week,game,release_date)
            VALUES ({},'{}','{}','{}');"""
    try:
        cursor.execute(sql.format(week_id, week, game, release))
        db.commit()
    except:
        print("SOMETHING HAPPENED! "+title)
        db.rollback()


def extract_game(g, conn):
    try:
        fields = ['title', 'release', 'week']
        rdate = datetime.strptime(g['release_date'], '%b %d, %Y')
        odate = datetime(2017, 3, 2, 0, 0)
        week_id = math.floor((rdate - odate).days / 7)
        release = str(rdate)[:10]
        week = str(last_thursday(release))[:10]
        title = re.sub("'","''", g['title'])
        title = re.sub('"', "''", title)
        title = re.sub("&[^ ]*?;", "", title)
        title = re.sub("é", "e", title)
        title = re.sub("®", "", title)
        title = re.sub("Û", "U", title)
        write_to_mysql(week_id, week, title, release, conn)
        if rdate < last_thursday():
            return 1
        else:
            return 0
    except KeyError:
        return 1


u = "https://www.nintendo.com/json/content/get/filter/game?limit=40&offset={0}&system=switch&sort=release&direction=des"
go = True
i = 0
while go:
    page = requests.get(u.format(str(i*40)))
    data = json.loads(page.content.decode('utf-8'))
    games = data['games']['game']
    res = [extract_game(g, mysql_conn['writer']) for g in games]
    go = functools.reduce(lambda a, b: a+b, res) == 0
    i += 1
    time.sleep(3)
    print('Page '+str(i)+' is done!')
