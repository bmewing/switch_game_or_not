'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysqlconn = require('../mysql.json');
var alexaRouter = _express2.default.Router();

var pool = _mysql2.default.createPool(mysqlconn.writer);

function get_one_fake() {
    var q = '(select game_id, game, 1 as `real` from games order by rand() limit 1) UNION (select game_id, game, 0 as `real` from fake_games order by rand() limit 1);';
    return q;
}

function get_no_fake() {
    var q = 'select game_id, game, 1 as `real` from games order by rand() limit 2;';
    return q;
}

function get_two_fake() {
    var q = 'select game_id, game, 0 as `real` from fake_games order by rand() limit 2;';
    return q;
}

alexaRouter.route('/').get(function (req, res) {
    var trigger = Math.random();
    var q = '';
    if (trigger < 0.5) {
        q = get_one_fake();
    } else if (trigger < 0.75) {
        q = get_two_fake();
    } else {
        q = get_no_fake();
    }
    console.log(q);
    pool.query(q, function (err, rows) {
        if (err) {
            res.status(100).send(err);
        }
        res.json(rows.sort(function (a, b) {
            return 0.5 - Math.random();
        }));
    });
}).post(function (req, res) {
    var data_packet = req.body;
    var q = 'INSERT INTO results (week_id, game_id, user_id, correct) VALUES ';
    q = q + "('9999','" + data_packet.game_id + "','" + data_packet.user_id + "','" + data_packet.correct + "')";
    pool.query(q, function (err, result) {
        if (err) {
            //                 res.status(100).send(err);
            res.json(err);
        }
        res.status(201).json(result);
    });
});

exports.default = alexaRouter;