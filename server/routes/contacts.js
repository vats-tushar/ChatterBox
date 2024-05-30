import express from 'express';
import pool from '../db.js'
const router3 = express.Router();
import model from '../middleware/fetchUser.js';

// store contact at /api/contacts/savecontact
router3.post('/savecontact', model, async (req,res)=>{
    try{
        let userid=req.user;
        let contid= req.body.email;
        let a,b;
        for (let i = 0; i < userid.length; i++) {
            if(userid[i]==='@'){
                a=userid.slice(0,i);
            }
        }
        for (let i = 0; i < contid.length; i++) {
            if(contid[i]==='@'){
                b=contid.slice(0,i);
            }
        }
        let convoid = a+'&'+b;
        let name = req.body.name;
        await pool.query(`insert into contacts values('${userid}','${contid}','${name}', '${convoid}')`);
        res.send("Success");
    }
    catch(error){
        console.error(error.message);
        if(error.errno) res.status(500).send("Given email is not registered.")
        else res.status(500).send("Failed");
    }
})

router3.get('/getcontacts', model, async (req,res)=>{
    try{
        let userid=req.user;
        let user = await pool.query(`select contactid, contname from contacts where email = '${userid}'`);
        res.send(user[0])
    }catch(error){
        console.error(error.message);
        res.status(500).send("Failed");
    }
})
export default router3;