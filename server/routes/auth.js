import express from 'express';
import pool from '../db.js'
const router1 = express.Router();
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import model from '../middleware/fetchUser.js';

const JWT_SEC="Signed_by$tushar2002";

//ROUTE 1. Create a user using: POST "/api/auth/createuser". Doesn't require login
router1.post('/createuser',[
    body('name').isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({min:5})
] ,async (req,res)=>{
    let success;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(req);
        return res.status(400).json({errors: errors.array()});
    }
    try{
        // check email exists
        let temp = await pool.query(`select * from users where email='${req.body.email}'`)
        if(temp[0].length>0){
            success=false;
            return res.status(401).json({success, error: "Sorry email exists"});
        }
        //create user
        const salt=await bcrypt.genSalt(10);
        const secpass=await bcrypt.hash(req.body.password,salt);
        console.log(secpass);
        await pool.query(`insert into users values('${req.body.email}', '${secpass}', 'null', '${req.body.name}')`)
        
        const data = req.body.email + '&' + req.body.password;
        success=true;
        const authToken=jwt.sign(data,JWT_SEC);
        res.json({success, authToken});
    } catch(error){
        console.error(error.message);
        res.status(500).send("Error Occured!");
    }
    
})

//ROUTE 2. authenticate a user using: POST "/api/auth/login". Doesn't require login
router1.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cant be blank').exists(),

] ,async (req,res)=>{
    let success;
    //check error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success=false;
        console.log('here');
        return res.status(400).json({success, errors: errors.array()});
    }

    const {email, password}=req.body;
    try{
        let user=await pool.query(`select * from users where email='${email}'`)
        if(!user){
            success=false;
            return res.status(400).json({success, error: "Try again with correct details."});
        }
        console.log(user[0][0])
        const passCompare = bcrypt.compareSync(password, user[0][0].password);
        if(!passCompare){
            success=false;
            return res.status(400).json({success, error: "Try again with correct details."});
        }

        const data = req.body.email + '&' + req.body.password;
        const authToken=jwt.sign(data,JWT_SEC);
        success=true;
        res.json({success, authToken});
    } catch(error){
        console.error(error.message);
        res.status(500).send("Error Occured!");
    }
});

router1.get('/getuser', model , async (req,res)=>{
    try{
        let userId = req.user;
        const user=await pool.query(`select name,email,sockid from users where email='${userId}'`);
        res.send(user[0][0]);
    }catch(error){
        console.error(error.message);
        res.status(500).send("Error Occured!");
    }
});

export default router1