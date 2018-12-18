import express from 'express';
import mysql from 'mysql';
var mysqlconn = require('./mysql.json');
const titleRouter = express.Router();

var pool = mysql.createPool(mysqlconn);

titleRouter.use('/:week', (req,res,next)=>{
  pool.getConnection((err,connection)=>{
    if(err)
      res.status(100).send(err)
    else{
      connection.on('error', (err)=>{
        res.status(100).send(err)
      })
      var q = 'select * from games where week="'+req.params.week+'";';
      connection.query(q, (err, rows, fields) => {
        connection.release();
        if(err)
          res.status(100).send(err);
        else {
          req.games = rows;
          next();
        }
      })
    }
  })
  
})
titleRouter.route('/:week')
  .get((req,res)) => {
    var
  }