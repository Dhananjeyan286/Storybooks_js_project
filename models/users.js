const mongoose=require("mongoose")

const userschema=new mongoose.Schema({
    googleid:{
        type:String,
        required:true
    },
    displayname:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    createdat:{
        type:Date,
        default:Date.now()
    }
})

const db=mongoose.model("users",userschema)
module.exports=db