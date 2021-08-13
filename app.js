/*  Created with Mongodb,Express,Node with 
Google OAuth for authentication

to start the app type "npm start"
or "npm run dev"           */


const express=require("express")
const app=express()
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const connectDB=require("./config/db")
const morgan=require("morgan")
const exphbs=require("express-handlebars")
const methodoverride=require("method-override")
const path=require("path")
const passport=require("passport")
const session=require("express-session")
const flash=require("connect-flash")
const MongoStore=require("connect-mongo")(session)//note: use "npm i connect-mongo@3" to install connect mongo instead of "npm i connect-mongo" becuase the latest version does not work in this code, this is used to store sessions in db for more understanding see in express-session middleware in this file
const {formatdate,striptags,truncate,editicon,select,merror}=require("./helpers/hbs")


//Load config
dotenv.config({path:"./config/config.env"})

//body parser
app.use(express.urlencoded({extended:false}))//to accept  data from form tht is post request
app.use(express.json())//to accept json data

//method-override see code in "https://www.npmjs.com/package/method-override"
app.use(methodoverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
}))

//getting passport
require("./config/passport")(passport)

//calling database
connectDB()

if(process.env.NODE_ENV === "development")
app.use(morgan("dev"))

//init handlebars with extension set as .hbs instead of .handlebars
// and defaultlayout set in main.hbs
app.engine('.hbs', exphbs({helpers:{formatdate,striptags,truncate,editicon,select,merror},defaultLayout:"main",extname: '.hbs'}));
app.set('view engine', '.hbs');//to use all the files in helpers folder we need write helpers:{file_names}

//express-session middleware
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false,store:new MongoStore({mongooseConnection:mongoose.connection}) }));//put saveUnintialized to false because we do not want to create a session until something is stored in the session ,this store is used to store the login credentials so once u logged in nd if u turn off the server and again turn on the server using "npm run dev" and if u refresh chrome u dont need to log in again because the express-session wld have stored the login credentials and it will also be available in mondo db cloud tht is atlas in a new model 


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect-flash middleware
app.use(flash())

//global variables
app.use((req,res,next)=>{
    res.locals.user=req.user || null//user is a global variable if the user is logged in then their details will be in this variable else it will be null
    res.locals.success_msg=req.flash("success_msg")
    res.locals.failure_msg-req.flash("failure_msg")
    next()//next function needs to be called because once the global variables are declared then we should say to the computer tht end of global variable declaration which is said by the next() function so that the computer will go and do the next task else if we dont mention next() function then the computer will wait here indefinitely
})

//static folders
app.use(express.static(path.join(__dirname,"public")))

app.use("/",require("./routes/index"))
app.use("/auth",require("./routes/auth"))
app.use("/stories",require("./routes/stories"))


const PORT=process.env.PORT || 5000

app.listen(PORT,()=> {
    console.log(`${process.env.NODE_ENV} ${PORT}`)
})