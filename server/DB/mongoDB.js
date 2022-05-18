const mongoose = require("mongoose");

const DB = ()=>{

    mongoose.connect("mongodb://127.0.0.1:27017/product")
    .then(()=>{
        console.log("Database Connected")
    })
    .catch((err)=>{
        console.log(err)
    })

}

module.exports = DB;