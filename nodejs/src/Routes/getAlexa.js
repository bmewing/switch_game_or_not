import express from 'express';
import mysql from 'mysql';
var mysqlconn = require('../mysql.json');
const alexaRouter = express.Router();

var pool = mysql.createPool(mysqlconn.writer);

function get_one_fake() {
    var q = '(select game_id, game, 1 as `real` from games order by rand() limit 1) UNION (select game_id, game, 0 as `real` from fake_games order by rand() limit 1);';
    return(q);
}

function get_no_fake(){
    var q = 'select game_id, game, 1 as `real` from games order by rand() limit 2;'
    return(q);
}

function get_two_fake(){
    var q = 'select game_id, game, 0 as `real` from fake_games order by rand() limit 2;'
    return(q);
}

alexaRouter.route('/')
    .get((req,res)=>{
        let trigger = Math.random()
        let q = ''
        if(trigger < 0.5){
            q = get_one_fake();
        } else if(trigger < 0.75){
            q = get_two_fake();
        } else {
            q = get_no_fake();
        }
        console.log(q);
        pool.query(q,(err,rows) => {
            if(err){
                res.status(100).send(err);
            }
            res.json(rows.sort(function(a,b){return 0.5 - Math.random()}));
        })
    })
    .post((req,res)=>{
        let data_packet = req.body
        var q = 'INSERT INTO results (week_id, game_id, user_id, correct) VALUES ';
        q = q + "('9999','" + data_packet.game_id + "','" + data_packet.user_id + "','" + data_packet.correct + "')" 
        pool.query(q, (err,result) => {
            if(err){
//                 res.status(100).send(err);
                res.json(err)
            }
            res.status(201).json(result)
        })
    })

export default alexaRouter