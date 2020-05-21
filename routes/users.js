const express = require('express')
const router=express.Router()
const User= require('../models/user')
const mongoose= require('mongoose')

const middleware=require('../middleware')
const bcrypt = require ("bcrypt")
const db= mongoose.connection;

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')



//authentication routes

router.get('/login', (req, res)=>{
    res.render('login.ejs')
})
router.get('/register', (req, res)=>{
    res.render('register.ejs')
})

//GET all users from /users/

router.get('/', async(req,res)=>{
    try{
        const users = await User.find()
        res.send(users)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})
//getting one
router.get('/:id',middleware.getUser, (req,res)=>{
    console.log(User.find())
    res.json(res.user)
})
//Creating one

router.post("/register", (req,res)=>{
console.log(req.body)
    bcrypt.hash(req.body.password, 5, function (err,  hash) {
    new User({
     name: req.body.name,
     email: req.body.email,
     password: hash
     }).save().then((data) =>{
      if (data) {
        res.status(201).json(data)
      }
    });
   });
  });

//Update one
router.patch('/:id',middleware.getUser, async (req, res)=>{
    if(req.body.name!=null){
        res.user.name=req.body.name;
      }
      if(req.body.email!=null){
        res.user.email=req.body.email;
      }
      if(req.body.password!=null){
        res.user.password=req.body.password;
      }
      try{
        const updatedUser = await res.user.save()
        res.json(updatedUser)
        
      }catch(err){
        res.status(400).json({message: err.message})
      }
})
// deleting one
router.delete('/:id',middleware.getUser, async(req,res)=>{
    try{
        await res.user.remove()
         res.json({message: "user deleted"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})


module.exports=router