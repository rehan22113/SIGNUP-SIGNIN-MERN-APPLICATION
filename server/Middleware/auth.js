const RegData = require('../schemas/Register')
// const session = require('express-session');
const jwt = require("jsonwebtoken")
// const auth = async (req, res, next) => {
//     const bearerHeader = req.headers['authorization'];
//     if (typeof bearerHeader != "undefined") {
//             const bearer = bearerHeader.split(" ");
//             req.token = bearer[1];
//             jwt.verify(req.token,"secret123",(err,authdata)=>{
//                 if(err){
//                     res.json({result:err})
//                 }else{
//                     next()
//                 }
//             })
//     } else {
//         res.status(400).json({error: "Error Session Timeout"}
//         )
//     }
// }
const auth = async(req,res,next)=>{
    try{
    
    const token = req.cookies.jwt;
    const verifyUser = await jwt.verify(token,"anytoknen32wordmore")
    console.log(verifyUser);
    const user = await RegData.findOne({_id:verifyUser._id,"tokens.token":token})
    console.log(user.fname+" "+user.lname);
    req.token = token;
    req.user = user;
    next();
    }catch(ERR){
    res.status(400).send(ERR);
    }
    }

module.exports = auth;
