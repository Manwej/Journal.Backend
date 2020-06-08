const express = require('express')
const router=express.Router()
const app = express()
const mongoose= require('mongoose')
const bcrypt = require ("bcrypt")

const middleware=require('../middleware/index.js')
const User= require('../models/user')
const db= mongoose.connection;

//GET all users from /users/
// router.get('/', async(req,res)=>{
//     try{
//         const users = await User.find()
//         res.send(users)
//     }catch(err){
//         res.status(500).json({message: err.message})
//     }
// })
//getting one
router.get('/:id',middleware.getUser, (req,res)=>{
    console.log(User.find())
    res.json(res.user)
})
//Creating one
router.post("/", middleware.checkNotAuthenticated,(req,res)=>{
    console.log("hello from post")
    bcrypt.hash(req.body.password, 5, function (err,  hash) {
        new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
            }).save().then((data) =>{
               console.log(data.name)
             if (data) {
               //res.status(201).json(data)
               res.redirect('/login')
             }
           }).catch((err)=>{
               console.log(err)
               res.redirect('/register')
           });
          });
          
   })

//Update one
router.patch('/:id',middleware.getUser,middleware.checkAuthenticated, async (req, res)=>{
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
router.delete('/:id',middleware.getUser, middleware.checkAuthenticated, async(req,res)=>{
    try{
        await res.user.remove()
         res.json({message: "user deleted"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})


module.exports=router