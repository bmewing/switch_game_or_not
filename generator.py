import json
import random
import re


def choose_letter(s):
    r = random.random()
    p = probs[s]
    i = min([i for i, x in enumerate([r < l for l in list(p.values())]) if x])
    return list(p.keys())[i]


def gen_title(title):
    go = True
    while go:
        if title[-3:] == "```":
            go = False
        else:
            title = title + choose_letter(title[-3:])
    return title


with open('markov_probabilities.json') as jsonfile:
    probs = json.load(jsonfile)

start = [k for k in list(probs.keys()) if re.search('^\*+$',k)][0]
out = gen_title(start)
print(out)