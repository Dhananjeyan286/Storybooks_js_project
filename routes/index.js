const express=require("express")
const router=express.Router()
const {ensureauth,ensureguestauth} =require ("../middleware/auth")
const stories=require("../models/stories")


router.get("/",ensureguestauth,(req,res)=>{
    res.render("login",{
        layout:"login"//here layout is not filename it is a property nly login is filename which is present in "layouts" directory
    })
})


router.get("/dashboard",ensureauth,async(req,res)=>{
    try{
    const story=await stories.find({user:req.user.id}).lean()//the lean function transforms the documents sent by findOne funtion into the story variable in the form of javascript objects
    res.render("dashboard",{
        name:req.user.firstname,//user data will be stored in every page automatically once the user is logged in, in req.user variable from the users model in ../models/users
        story
    })
    }
    catch(err)
    {
        console.log(err)
        res.render("error/500")//here alone we are putting error/500 in rest all we are putting /dashboard because these error files are not default files
    }
})



module.exports=router