import jwt from 'jsonwebtoken';
const JWT_SEC="Signed_by$tushar2002";

const fetchuser = (req,res,next)=>{
    // get user from jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token) res.status(401).send({error: "Please authenticate using vali token"});
    try {
        const data = jwt.verify(token,JWT_SEC);
        let q;
        for (let index = 0; index < data.length; index++) {
            if(data[index]==='&') q=index;
        }
        req.user=data.slice(0,q);
        next();
    } catch (error) {
        res.status(401).send({error: "Please authenticate using validd token"});
    }
    
}

export default fetchuser