const express=require("express")
const passport=require("passport")
const router=express.Router()

//here the "/" represenets "/auth"
router.get('/google',//see this code in documentation og passport.js google oauth 2.0
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',//note this is the callback function which gets automatically called when we visit the page localhost:3000/auth/google....note other than in this line that is where all router.get("/") is present there alone "/" means "/auth" other than this line where all this "/" comes it refers to the homepage
  passport.authenticate('google', { failureRedirect: '/' }),//here "/" represents the homepage
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

router.get("/logout",(req,res)=>{
  req.logout()
  res.redirect("/")
})  

  module.exports=router