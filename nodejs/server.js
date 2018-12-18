'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _getTitles = require('./Routes/getTitles.js');

var _getTitles2 = _interopRequireDefault(_getTitles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Constants
var PORT = 8080;
var HOST = '0.0.0.0';
var app = (0, _express2.default)();

// App
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use('/api/titles', _getTitles2.default);
app.use(_express2.default.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: _path2.default.join(__dirname, './public') });
});

app.listen(PORT, HOST);
console.log('Running on http://' + HOST + ':' + PORT);