import express from 'express';
import pool from '../db.js'
const router2 = express.Router();
import model from '../middleware/fetchUser.js';

//store socket id at api/socketID/storeID
router2.post('/storeID', model , async (req,res)=>{
    try{
        let userId = req.user;
        let id = req.body.id;
        let response = await pool.query(`update users set sockid = '${id}' where email = '${userId}'`);
        res.send("Success");
    }catch(error){
        console.error(error.message);
        res.status(500).send("Error Occured!");
    }
});

router2.post('/getid', async (req, res)=>{
    try{
        let id = req.body.id;
        let response = await pool.query(`select sockid from users where email="${id}"`);
        res.send(response[0][0]);
    }
    catch{
        console.error(error.message);
        res.status(500).send("Error occured");
    }
})

export default router2;