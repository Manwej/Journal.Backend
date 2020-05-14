const express = require('express')
const router=express.Router()
const User= require('../models/user')

const middleware=require('../middleware')

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
router.post('/', (req,res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    
        const newUser =  user.save()
        res.status(201).json(newUser)
    
        //res.status(400).json({message: err.message}) 
    
})
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
// async function getUser (req,res,next){
//     let user
//     try{
//         user = await User.findById(req.params.id)
//         if (user==null){return res.status(404).json({message: "cannot find user"})}
//     }catch(err){
//         return res.status(500).json({message: err.message})
//     }
//     res.user=user;
//     next()
// }
module.exports=router