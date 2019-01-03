#!/usr/bin/python3

import pymysql
import json
import csv

with open('../nodejs/mysql.json') as f:
    mysql_conn = json.load(f)

def fetch_games(conn, outfile):
    db = pymysql.connect(conn['host'], conn['user'], conn['password'], conn['database'])
    cursor = db.cursor()
    sql = "SELECT * FROM results;"
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for r in results:
            outfile.writerow(r)
    except:
        print("Error, unable to fetch data")
    return 1

with open('results_2018_12_21.csv', 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    fetch_games(mysql_conn['reader'], csvwriter)