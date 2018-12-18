import express from 'express';
import mysql from 'mysql';
var mysqlconn = require('../mysql.json');
const titleRouter = express.Router();

var pool = mysql.createPool(mysqlconn);

function get_today() {
    var date = new Date();
    
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    
    var mmChars = mm.split('');
    var ddChars = dd.split('');
    
    return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
}

titleRouter.route('/')
    .get((req,res)=>{
        var q = 'select distinct week from games where week <= "'+get_today()+'";';
        pool.query(q,(err,rows) => {
            if(err){
                res.status(100).send(err);
            }
            res.json(rows)
        })
    })

titleRouter.use('/:week', (req,res,next)=>{
    console.log(req.params.week)
    var q = 'select * from games where week="'+req.params.week+'";';
    pool.query(q,(err,rows) => {
        if(err){
            res.status(100).send(err);
        }
        req.games = rows;
        next();
    })  
})
titleRouter.route('/:week')
  .get((req,res) => {
    res.json(req.games)
  })

export default titleRouter