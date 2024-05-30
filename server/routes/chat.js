import express from 'express';
import pool from '../db.js'
const router4 = express.Router();
import model from '../middleware/fetchUser.js';

//store mssg at /api/chat/savemsgs
router4.post('/savemsgs', model, async (req,res)=>{
    try{
        let mine=req.user;
        let other=req.body.oppId;
        let msg = req.body.msgText;
        let isSent = req.body.isSent;
        let convoid = await pool.query(`select convoid from contacts where email='${mine}' and contactid = '${other}'`);

        let svmsquery;
        if(isSent) svmsquery= `insert into chats(convoid, msgText, isSent) values ('${convoid[0][0].convoid}', '${msg}', '${isSent}')`;
        else svmsquery = `insert into chats(convoid, msgText, isSent ,viewed ) values('${convoid[0][0].convoid}', '${msg}', '${isSent}', ${req.body.viewed})`
        
        await pool.query(svmsquery);
        res.send("Success");
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Failed");
    }
})

router4.post('/getmsgs', model, async (req, res)=>{
    try{
        let sender=req.user;
        let receiver=req.body.id;
        let convoid = await pool.query(`select convoid from contacts where email='${sender}' and contactid = '${receiver}'`);
        let msgs = await pool.query(`select convoid, msgid, msgText, isSent, viewed from chats where convoid='${convoid[0][0].convoid}' order by Timestamp`);

        let arr = msgs[0];
        arr.forEach(element => {
            element.oppId = receiver;
        });
        res.send(arr);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Failed");
    }
})

//store unread mssg at /api/chat/saveunreadmsgs
router4.post('/saveunreadmsgs', model, async (req,res)=>{
    try{
        let mine=req.user;
        let other=req.body.oppId;
        let msg = req.body.msgText;
        let isSent = req.body.isSent;
        let convoid = await pool.query(`select convoid from contacts where email='${other}' and contactid = '${mine}'`);
        console.log(convoid[0][0].convoid)

        let svmsquery = `insert into chats(convoid, msgText, isSent ,viewed ) values('${convoid[0][0].convoid}', '${msg}', '${isSent}', 0)`
        
        await pool.query(svmsquery);
        res.send("Success");
    }
    catch(error){
        console.log(error.message);
        res.status(600).send("Failed");
    }
})

router4.post('/viewmsg', async (req,res)=>{
    try{
        let id = req.body.msgid;
        await pool.query(`update chats set viewed = 1 where msgid = ${id}`)
        console.log("done")
        res.send("Success");
    }
    catch(error){
        console.log(error.message);
        res.status(700).send("Failed");
    }
})

export default router4;