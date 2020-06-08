require('dotenv').config()
const express = require('express')
const app = express()
const router= express.Router()
const middleware=require('./middleware/index.js')

const cors = require("cors");
app.use(cors());
// DB connection with mongoose
const mongoose= require('mongoose')
mongoose.set('useNewUrlParser', true)
mongoose.connect(process.env.DATABASE_URL, {useUnifiedTopology: true})
mongoose.set('useCreateIndex', true);
const db= mongoose.connection;
db.on('error', (error)=>console.log(error))
db.once('open', ()=>console.log("connected to database"))

// setting up JSON
app.use(express.json())//a. express.json() is a method inbuilt in express to recognize the incoming 
//Request Object as a JSON Object. This method is called as a middleware in your 
//application using the code: app.use(express.json()); another way would be to use body parser
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false })) // to get data from html forms as req.body

const bcrypt = require('bcrypt')
const User= require('./models/user')
const session = require('express-session')

//passport setup
const passport = require('passport')
const initializePassport = require('./middleware/passport-config')
initializePassport(passport)

app.use(session({
        secret: "johnny",
        resave: false,
        saveUninitialized: false
    }))
app.use(passport.initialize())
app.use(passport.session())
    
// connect the different routes of the app
const userRouter=require('./routes/users')
const pageRouter= require('./routes/journalpages')
app.use('/users', userRouter)
app.use('/', pageRouter)
app.use(function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});


// Basic routes for login and register
app.get('/',  middleware.checkAuthenticated, (req,res)=>{
    res.render('index.ejs', { name: req.user.name })
})
app.get('/login', middleware.checkNotAuthenticated, (req,res)=>{
    res.render('login.ejs')
})
app.post('/login', middleware.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'}), (req, res)=>{
        console.log(req.body)
    }
)
app.get('/register', middleware.checkNotAuthenticated, (req,res)=>{
    res.render('register.ejs')
})

app.delete('/logout', (req,res)=>{
    req.logOut()
    res.redirect('/login')

})
// db.collection.save(
   
//     {
//         questions:["Name 3 things you are grateful for today.", 
//         "Name 3 things that would make today perfect.", 
//         "Write down your daily affirmation.", 
//         "Name 3 awesome things you did today.", 
//         "What could you have done better today?"],
//     }
//  )

app.listen(5000, ()=>{
    console.log("server has started")
})