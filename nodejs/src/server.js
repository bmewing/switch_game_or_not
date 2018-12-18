import express from 'express';
import mysql from 'mysql';
import path from 'path';
import bodyParser from 'body-parser';
import titleRouter from './Routes/getTitles.js'

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();

// App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/titles',titleRouter)
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile('index.html',{root: path.join(__dirname,'./public')});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);