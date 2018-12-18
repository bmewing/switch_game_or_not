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
var titleRouter = _express2.default.Router();

var pool = _mysql2.default.createPool(mysqlconn);

function get_today() {
    var date = new Date();

    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
}

titleRouter.route('/').get(function (req, res) {
    var q = 'select distinct week from games where week <= "' + get_today() + '";';
    pool.query(q, function (err, rows) {
        if (err) {
            res.status(100).send(err);
        }
        res.json(rows);
    });
});

titleRouter.use('/:week', function (req, res, next) {
    console.log(req.params.week);
    var q = 'select * from games where week="' + req.params.week + '";';
    pool.query(q, function (err, rows) {
        if (err) {
            res.status(100).send(err);
        }
        req.games = rows;
        next();
    });
});
titleRouter.route('/:week').get(function (req, res) {
    res.json(req.games);
});

exports.default = titleRouter;