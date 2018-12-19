import express from 'express';
import mysql from 'mysql';
var mysqlconn = require('../mysql.json');
const scoreRouter = express.Router();

var write_pool = mysql.createPool(mysqlconn.writer);

scoreRouter.route('/')
    .post((req,res)=>{
        let data_packet = req.body
        var q = 'INSERT INTO results (week_id, game_id, user_id, correct) VALUES ';
        for(var i=0; i < data_packet.length; i++){
            if(i > 0){
                q += ","
            }
            q += "('" + data_packet[i].join("','") + "')"
        }
        write_pool.query(q, (err,result) => {
            if(err){
//                 res.status(100).send(err);
                res.json(err)
            }
            res.status(201).json(result)
        })
    })

export default scoreRouter