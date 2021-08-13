const mongoose=require ("mongoose")

const storiesschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    body:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"public",
        enum:["public","private"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,//stating the type of this as objectId
        ref:"users"//stating tht take the value of the _id from the respective id of the user who is creating it 
    },
    createdat:{
        type:Date,
        default:Date.now()
    }
})

const db=mongoose.model("stories",storiesschema)
module.exports=db