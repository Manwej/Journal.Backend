require("dotenv").config();
const express = require("express");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const middleware = require("../middleware/index.js");
const User = require("../models/user");
const db = mongoose.connection;

//Creating one
router.post("/register", async (req, res) => {
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
          auth: false,
        });
        // const tokenPayload = {
        //   id: user.id,
        //   name: user.name,
        //   email: user.email,
        // };

        // Sign token
        jwt.sign(
          { id: user.id },
          "hello",
          {
            expiresIn: 3600,
          },
          (err, token) => {
            res.status(200).json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            });
          }
        );
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
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) throw Error("User Does not exist");
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Error("Invalid credentials");
    // Create JWT Payload
    // const tokenPayload = {
    //   id: user.id,
    //   name: user.name,
    //   email: user.email,
    // };
    // Sign token
    const token = jwt.sign({ id: user.id }, "hello", { expiresIn: 3600 });
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});
//get user because jwt is stateless
router.get("/user", middleware.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //-pasword leaves pw out
    if (!user) throw Error("User Does not exist");
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

//Update one
router.patch(
  "/:id",
  middleware.getUser,
  middleware.checkAuthenticated,
  async (req, res) => {
    if (req.body.name != null) {
      res.user.name = req.body.name;
    }
    if (req.body.email != null) {
      res.user.email = req.body.email;
    }
    if (req.body.password != null) {
      res.user.password = req.body.password;
    }
    try {
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);
// deleting one
router.delete(
  "/:id",
  middleware.getUser,
  middleware.checkAuthenticated,
  async (req, res) => {
    try {
      await res.user.remove();
      res.json({ message: "user deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
