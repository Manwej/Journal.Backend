const express = require('express')
const router=express.Router()
const User= require('../models/user')
const mongoose= require('mongoose')

const middleware=require('../middleware')
const bcrypt = require ("bcrypt")
const db= mongoose.connection;

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
// router.post('/', async (req,res)=>{
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//     })
//     try{
//         const newUser =  await user.save()
//         res.status(201).json(newUser)
//     }catch(err){
//         res.status(400).json({message: err.message})
//     }
   
// })

const encryptTest= async (target) =>{
            bcrypt.hash(target, 5,  (err, encrypted) => {
                target = encrypted;
                console.log("the encrypted password: " + target)
            })  
            return target;

}

router.post("/", (req,res)=>{
    //get data from the views and add to mongDB
    // let test = await encryptTest(req.body.password)
    // console.log("from the post route, encrypted pw is: " + await encryptTest(req.body.password))
    // console.log(test)
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: await encryptTest(req.body.password)
//     })
//     try {
//         //let test = await encryptTest(req.body.password)
//         const newUser =  await user.save()
//         res.status(201).json(newUser)
//     } catch (err){
//         console.log("from the post route")
//         res.status(400).json({message: err.message})
//     }
// })
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