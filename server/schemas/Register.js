const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")
const Reg =new mongoose.Schema({
    fname:{type:String,
        required:true},
    lname:{type:String,
        required:true},
    email:{type:String,
        required:true},
    pass:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
          type:String,
          unique:true
            }
         }]
})
Reg.pre("save",async function(next){
    try{

        if(this.isModified('pass')){
            this.pass = await bcrypt.hash(this.pass,10);
        }
        next()
    }catch(err){
        console.log("Password Not be hashed")
        console.log(err);
    }
})

Reg.methods.generateAuthToken = async function(){
    try{
     const token = jwt.sign({_id:this._id.toString()},"anytoknen32wordmore");
     this.tokens = this.tokens.concat({token:token})
     await this.save();
     return token;
    }catch(err){
       res.send("this is an error")
    }
    }

const register = mongoose.model("User",Reg)

module.exports = register