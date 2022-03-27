const Express = require("express")
const App = Express();
const mongodb = require('./DB/mongoDB')
const register = require('./schemas/Register')
const productinfo =require('./schemas/productInfo')
const bodyParser = require('body-parser')
const cors = require('cors');
const session = require("express-session");
const jwt = require('jsonwebtoken');
const auth = require("./Middleware/auth");
const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")
/*================*/
/*Connect DB*/ 
mongodb();
/*===============*/
/*Middleware*/
App.use(cookieParser())
App.use(cors());
App.use(Express.json())
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));
App.use(session({
	secret:'secret123',
    resave:true,
    saveUninitialized:true
	}));
App.use(Express.json())
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));

/*================*/
App.get("/",auth,(req,res)=>{
    res.send("Running")
})
App.post("/user",async(req,res)=>{
    try{
        const {fname,lname,email,pass} = req.body;
        console.log(fname + " " + email)
        const RegData = new register({
            fname,lname,email,pass
        })
        const token = await RegData.generateAuthToken()
        console.log(token);
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+50000),
            httpOnly:true
        })
        await RegData.save()
        
        res.status(200).send("Data sent")
    }catch{
        
       res.send("Error occur data not send")
    }
})
App.post("/login",async(req,res)=>{
    try{
        const {email,pass} = req.body;
        const data = await register.findOne({email})
        const isMatch = await bcrypt.compare(pass,data.pass)
        console.log(isMatch)
        if(isMatch){
           const token= await data.generateAuthToken();
            res.cookie("jwt",token,{
                httpOnly:true
            })
            res.status(200).send("Login Success")
            console.log("Someone Login")
        }else{
            res.status(400).json({error:"Wrong Crediential"})
            console.log("Someone trying to Login")
        }
    }catch{
        res.status(400).json({error:"something not correct"})
    }
})
// App.post("/product",async(req,res)=>{
//     try{
//         const {name,category,sub,desc,contract,procedure,delivery,location,origin,price,payterm,buysell} =req.body;
//         console.log(name)
//         const proData = new productinfo({
//             name,category,sub,desc,contract,procedure,delivery,location,origin,price,payterm,buysell
//         })
//         await proData.save()
//         console.log("Data Saved Succesfully")

//     }catch{
//         console.log("Error Data not sent")
//     }
// })

App.get("/dashboard",auth,async(req,res)=>{
    try{
        const data = req.user
        res.status(200).json({message:"Authenticate",data})
    }catch(err){
        console.log("Error at dashboard "+err)
    }
})
App.get("/logout",auth,async(req,res)=>{
    try{
        req.user.tokens= req.user.tokens.filter((elem)=>{
                    return elem.token !== req.token
        })
        

        res.clearCookie("jwt",{path:"/"})
       await req.user.save()
        res.status(200).send({message:"success"})
    }catch(err){
        console.log(err)
    }
})
App.listen(4000,(err)=>{
    if(!err){
        console.log("Succesfully Started at 4000")
    }
    else{
        console.log(err)
    }
})