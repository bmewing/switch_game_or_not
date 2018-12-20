import express from 'express';
import mysql from 'mysql';
var mysqlconn = require('../mysql.json');
const titleRouter = express.Router();

var pool = mysql.createPool(mysqlconn.reader);

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
        var q = 'select distinct week from games where week <= "'+get_today()+'" order by week DESC;';
        pool.query(q,(err,rows) => {
            if(err){
                res.status(100).send(err);
            }
            var cleaned = [];
            for(var i = 0; i < rows.length; i++){
                cleaned.push(rows[i].week);
            }
            res.json(cleaned);
        })
    })

titleRouter.use('/:week', (req,res,next)=>{
    console.log(req.params.week)
    var q = '(select week_id, game_id, game, 1 as `real` from games where week="'+req.params.week+'") UNION (select null as `week_id`, game_id, game, 0 as `real` from fake_games order by rand() limit '+Math.floor(Math.random()*4+3)+');'
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
    var games = req.games;
    res.json(games.sort(function(a,b){return 0.5 - Math.random()}));
  })

titleRouter.route('/affiliate/text')
    .get((req,res)=>{
        var q = 'select msg from affiliate where active = 1 order by rand() limit 1;';
        pool.query(q,(err,rows) => {
            if(err){
                res.status(100).send(err);
            }
            res.json(rows[0].msg);
        })
    })

export default titleRouter