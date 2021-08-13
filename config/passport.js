var GoogleStrategy = require('passport-google-oauth20').Strategy;//see passport.js google oauth 2.0 documentation for the code
const mongoose=require("mongoose")
const users=require("../models/users")

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
    clientID: process.env.google_auth_id,
    clientSecret: process.env.google_auth_secret,
    callbackURL: "/auth/google/callback"
  },
    async function(accessToken, refreshToken, profile, cb) {//here cb is nothing but done
        //console.log(profile) use this first to see what does the google authorization returns tht is what is the name of the fields used in the database for instance below we use id,displayName,givenName,familyName,etc 
        const newuser={
            googleid:profile.id,//we are setting the value of profile.id to the googleid field in users model present in ../models/users.js
            displayname:profile.displayName,
            firstname:profile.name.givenName,
            lastname:profile.name.familyName,
            image:profile.photos[0].value
        }
        try{
            let user=await users.findOne({googleid:profile.id})
            if(user)//to log in if there is an existing user
            {
                cb(null,user)
            }
            else{//to create a new user
                let user=await users.create(newuser)
                cb(null,user)
            }
        }
        catch(err){
            console.log(err)
        }
  }
  ))
  passport.serializeUser(function(user, done) {//for serializer nd deserializer see documentation of passport-local
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    users.findById(id, function(err, user) {
      done(err, user);
    });
  });
}