const express=require("express")
const mongoose=require("mongoose")
const products=require("./models")
const bodyparser=require("body-parser")
const app=express()
const port=8080
app.listen(port,()=>console.log(`app is listening at ${port}`))
app.use(bodyparser.json())
mongoose.connect("mongodb://localhost/prouctsinventory",err=>{
    if(err){
        console.log(err)
    }else{
        console.log("connected to data base")
    }
})
app.get("/",async(req,res)=>{
    res.send("ok")
})
app.post("/",async(req,res)=>{
    try{
        //console.log(req.body)
        for(let i of req.body.payload){
           // console.log(i)
            if(i.operation=="add"){
                const data=await products.findOne({productId:i.productId})
               
                if(data){
                    //console.log(data)
                    await products.updateOne({productId:i.productId},{quantity:data.quantity+i.quantity})
                }else{
                    
                    await products.create({productId:i.productId,quantity:i.quantity})
                }
            }else{
                const data=await products.findOne({productId:i.productId})
               
                if(data){
                    //console.log(data)
                    if(data.quantity>=i.quantity){
                    await products.updateOne({productId:i.productId},{quantity:data.quantity-i.quantity})}
                    else
                    return res.status(400).json({
                        status:"error",
                        message:`quantity can't become negative modify of product ${data.productId}`
                    })
                }else{
                    
                    return res.status(400).json({  
                        status:"error",
                        message:` product ${i.productId} should be added before subtracting`
                    })
                }

            }
        }
        const productsList=await products.find()
        return res.status(200).json({
            status:"succes",
            message:"data modified",
            productsList
        })
    }
    catch(e){
        return res.status(400).json({
            status:"error",
            message:e.message
        })
    }
})