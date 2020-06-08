const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

function initialize(passport) {
    
  const authenticateUser = async (email, password, done) => {
    console.log("hello from autenticate user")
    //const user = getUserByEmail(email)
    User.findOne({
        email: email
    })
    .then(user => {
        console.log(user)
        if (!user) {
            return done(null, false, {
                message: "that email is not registered"
            })
        }
        bcrypt.compare(password, user.password, (err, isMatched) => {
            if (err) throw err
            if (isMatched) {
                console.log("matched")
                return done(null, user)
            } else {
                console.log("not matched")
                return done(null, false, {
                    message: "password incorrect"
                })
            }
        })
    })
    .catch(err => console.log(err))
    /*
const user = await User.findOne({
    email: email
})
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
    console.log(user)

    try {
      if (await bcrypt.compare(password, user.password, ()=>{console.log("comparing")})) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }*/
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser(function (user, done) {
    console.log("serializing user")
    done(null, user.id);
}); 
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        console.log("deserializing the user")
        done(err, user);
    });
});
//passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
//   passport.serializeUser((user, done) => {done(null, user.id)
// console.log("hello from serialize")})
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//   })
}


// Note for Me: apparaently the GetuserById and Email are not setup correctly resulting in errors along the line
module.exports = initialize