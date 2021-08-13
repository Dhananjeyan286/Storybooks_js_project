const mongoose=require("mongoose")

const connectDB=async()=>{//if nly we need to export one function like here then we can do like this else if we want to export 2 or more functions then we need to use a format like in the file "../middleware/auth.js"
    try{
        const con= await mongoose.connect(process.env.mongo_uri,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log(`DB connected ${con.connection.host}`)
    }
    catch(err){
        console.error(err)
        process.exit(1)
    }
    
}
module.exports=connectDB
