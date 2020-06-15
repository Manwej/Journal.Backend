const express = require('express')
const router=express.Router()
const app = express()
const mongoose= require('mongoose')
const bcrypt = require ("bcrypt")
const jwt = require("jsonwebtoken");

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
router.post("/register", async(req,res)=>{
  //Check for unique user
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(409).send("This user already exists");
  } else {
    // Store hash in your password DB.
    bcrypt.hash(req.body.password, 5, async (err, hash) => {
      // Insert the new user if it does not exist yet
      try {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          auth: false
        });
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
       
        // Sign token
        // jwt.sign(
        //   payload,
        //   key.secretOrKey,
        //   {
        //     expiresIn: 31556926, // 1 year in seconds
        //   },

        //   (err, token) => {
        //     res.json({
        //       success: true,
        //       token: "Bearer " + token,
        //     });
        //   }
        // );
        await user.save();
        console.log("user saved");
        res.send(user);
      } catch (error) {
        console.log("error");
        res.send(error);
      }
    });
  }
});
  //   console.log("hello from post")
  //   bcrypt.hash(req.body.password, 5, function (err,  hash) {
  //       new User({
  //           name: req.body.name,
  //           email: req.body.email,
  //           password: hash
  //           }).save().then((data) =>{
  //              console.log(data.name)
  //            if (data) {
  //              //res.status(201).json(data)
  //              res.redirect('/login')
  //            }
  //          }).catch((err)=>{
  //              console.log(err)
  //              res.redirect('/register')
  //          });
  //         });     
  //  })
// Login
router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({email}).then((user) => {
    // Check if user exists
    console.log("user", user);
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    if (user.auth) {
      return res.status(404).json({ err: "Login with Google" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch, err) => {
      console.log("error: ", err);
      console.log("isMatch: ", isMatch);
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email
        };

        // Sign token
        // jwt.sign(
        //   payload,
        //   key.secretOrKey,
        //   {
        //     expiresIn: 31556926, // 1 year in seconds
        //   },

        //   (err, token) => {
        //     console.log(err);
        //     res.json({
        //       success: true,
        //       token: "Bearer " + token,
        //     });
        //   }
        // );
      } else {
        return res.status(400).json({ err: "Password incorrect" });
      }
    });
  });
});
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