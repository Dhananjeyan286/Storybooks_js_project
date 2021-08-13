const express=require("express")
const { localeData } = require("moment")
const router=express.Router()
const {ensureauth} =require ("../middleware/auth")
const stories=require("../models/stories")

router.get("/add",ensureauth,(req,res)=>{
    res.render("stories/add")
})

//post request in stories url tht is to accept form data
router.post("/",ensureauth,async(req,res)=>{
    try{
        let errors=[]
        //console.log(req.body) first use this statement to see what gets printed note tht the field user will not get printed so use below statement
        req.body.user=req.user.id
        //console.log(req.body)
        if(!req.body.title)
        {
            errors.push({msg:"Enter a suitable title for your story"})
            res.render("stories/add",{body:req.body.body,status:req.body.status,errors})
        }
        else if(!req.body.body)
        {
            errors.push({msg:"Enter the content for your story"})
            res.render("stories/add",{title:req.body.title,status:req.body.status,errors})
        }
        else
        {
            await stories.create(req.body)
            res.redirect("/dashboard")
        }    
    }
    catch(err){
        console.log(err)
        res.render("errors/404")
    }
    
})
router.get("/",ensureauth,async(req,res)=>{
    try{
        const story=await stories.find({status:"public"}).populate("user").sort({createdat:"desc"}).lean()//here populate function populates the user field in stories model tht is it fetches the details about the user who created the story from the users model and puts it inside the field of user in stories model 
        res.render("stories/index",{story:story})
    }
    catch(err){
        console.log(err)
        res.render("errors/500")
    }
})

router.get("/edit/:id",ensureauth,async(req,res)=>{
    try{
        const story=await stories.findOne({_id:req.params.id}).lean()
        if(!story)
        res.render("errors/404")
        //checking whether the story belongs to the user who created it
        if(story.user.toString()!=req.user.id.toString())
        res.redirect("/stories")
        else{
            res.render("stories/edit",{
                story:story
            })
        }
    }    
    catch(err)
    {
        console.log(err)
        res.render("errors/500")
    } 
})

router.put("/:id",ensureauth,async(req,res)=>{
    try{
        let story=await stories.findOne({_id:req.params.id}).lean()
        if(!story)
        res.render("errors/404")
        //checking whether the story belongs to the user who created it
        if(story.user.toString()!=req.user.id.toString())
        res.redirect("/stories")
        else{
            //console.log(req.body)
            story =await stories.findOneAndUpdate({_id:req.params.id},req.body,{
                new:true,//if no story exists with tht id then create a new story with tht id
                runValidators:true//to check if it satisfy the constraints
            }) 
            res.redirect("/dashboard")
        }
    }    
    catch(err)
    {
        console.log(err)
        res.render("errors/500")
    } 
})

router.delete("/:id",ensureauth,async(req,res)=>{
    try{
        await stories.remove({_id:req.params.id})
        res.redirect("/dashboard")
    }
    catch(err)
    {
        console.log(err)
        res.render("errors/500")
    }    
    
})

router.get("/:id",ensureauth,async(req,res)=>{
    try{
        let story=await stories.findById(req.params.id).populate("user").lean()

        if(!story)
        return res.render("errors/500")
        
        res.render("stories/show",{story:story})
    }
    catch(err)
    {
        console.log(err)
        res.render("errors/500")
    }    
    
})

router.get("/user/:userid",ensureauth,async(req,res)=>{
    try{
        let story=await stories.find({user:req.params.userid,status:"public"}).populate("user").lean()
        
        res.render("stories/index",{story:story})
    }
    catch(err)
    {
        console.log(err)
        res.render("errors/500")
    }    
    
})

module.exports=router