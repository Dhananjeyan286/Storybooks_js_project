module.exports={//this is the format to export 2 or more functions
    ensureauth:(req,res,next)=>{//used to not allow to enter the website without signing in
        if(req.isAuthenticated())
        return next()
        else
        res.redirect("/")
    },
    ensureguestauth:(req,res,next)=>{//when logged in if u want to visit login page then it will redirect to "/dashboard" page
        if(req.isAuthenticated())
        res.redirect("/dashboard")
        else
        return next()
    }
}