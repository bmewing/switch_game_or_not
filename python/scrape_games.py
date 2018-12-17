import requests
import json
import csv
import functools
import time
import re
import math
from datetime import datetime


odate = datetime(2017, 3, 2, 0, 0)
thisweek = math.floor((datetime.today() - odate).days / 7)


def extract_game(g):
    try:
        fields = ['title', 'release', 'week']
        rdate = datetime.strptime(g['release_date'], '%b %d, %Y')
        odate = datetime(2017, 3, 2, 0, 0)
        week = math.floor((rdate - odate).days / 7)
        release = str(rdate)[:10]
        title = re.sub('"', "'", g['title'])
        title = re.sub("&[^ ]*?;", "", title)
        title = re.sub("é", "e", title)
        title = re.sub("®", "", title)
        title = re.sub("Û", "U", title)
        with open('switch_games_week_{}.csv'.format(str(week)), 'a', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fields)
            writer.writerow({
                             'title': title,
                             'release': release,
                             'week': week
                             })
        return 0
    except KeyError:
        return 1


u = "https://www.nintendo.com/json/content/get/filter/game?limit=40&offset={0}&system=switch&sort=release&direction=des"
go = True
i = 0
while go:
    page = requests.get(u.format(str(i*40)))
    data = json.loads(page.content)
    games = data['games']['game']
    res = [extract_game(g) for g in games]
    go = functools.reduce(lambda a, b: a+b, res) == 0
    i += 1
    time.sleep(3)
    print('Page '+str(i)+' is done!')
