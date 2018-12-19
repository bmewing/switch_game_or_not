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
var scoreRouter = _express2.default.Router();

var write_pool = _mysql2.default.createPool(mysqlconn.writer);

scoreRouter.route('/').post(function (req, res) {
    var data_packet = req.body;
    var q = 'INSERT INTO results (week_id, game_id, user_id, correct) VALUES ';
    for (var i = 0; i < data_packet.length; i++) {
        if (i > 0) {
            q += ",";
        }
        q += "('" + data_packet[i].join("','") + "')";
    }
    write_pool.query(q, function (err, result) {
        if (err) {
            //                 res.status(100).send(err);
            res.json(err);
        }
        res.status(201).json(result);
    });
});

exports.default = scoreRouter;