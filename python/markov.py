import csv
from collections import Counter
from functools import reduce
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


known = []
with open('switch_games.csv', newline='') as csvf:
    reader = csv.DictReader(csvf)
    known = [r['title'] for r in reader]

next_letter = {}
for k in known:
    next_letter = parse_name(k, 3, next_letter)

for i in next_letter.keys():
    next_letter[i] = calc_percent(next_letter[i])

with open("markov_probabilities.json", 'w') as outfile:
    json.dump(next_letter, outfile)