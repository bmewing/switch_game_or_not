'use strict';

import express from 'express';
import mysql from 'mysql';
import path from 'path';

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

// App
app.get('/', (req, res) => {
  res.sendFile('index.html',{root: path.join(__dirname,'./public')});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);