import requests
import json
import csv
import functools
import time


def extract_game(g, k):
    try:
        if g['title'] in k:
            print("Found existing game!")
            return 1
        else:
            with open('switch_games.csv', 'a', newline='') as csvfile:
                fields = ['title', 'release']
                writer = csv.DictWriter(csvfile, fieldnames=fields)
                writer.writerow({
                                 'title': g['title'],
                                 'release': g['release_date']
                                 })
            return 0
    except KeyError:
        return 1


known = []
with open('switch_games.csv', newline='') as csvf:
    reader = csv.DictReader(csvf)
    known = [r['title'] for r in reader]

u = "https://www.nintendo.com/json/content/get/filter/game?limit=40&offset={0}&system=switch&sort=release&direction=des"
go = True
i = 0
while go:
    page = requests.get(u.format(str(i*40)))
    data = json.loads(page.content)
    games = data['games']['game']
    res = [extract_game(g, known) for g in games]
    go = functools.reduce(lambda a, b: a+b, res) == 0
    i += 1
    time.sleep(3)
    print('Page '+str(i)+' is done!')
