const mongoose = require("mongoose")

const info = mongoose.Schema({
    productName:String,
    desc:String,
    contract:String,
    procedure:String,
    price:String,
    payterm:String,
    delivery:String,
    location:String,
    origin:String
})

const productInfo = mongoose.model("productsInfo",info)

module.exports = productInfo;