const mongoose=require("mongoose")
const schema=mongoose.Schema
const productblog=new schema({
    productId:{type:Number},
    quantity:{type:Number}

})
const products=mongoose.model("products",productblog)
module.exports=products