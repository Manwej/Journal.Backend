const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
        },
      email: {
          type: String,
          required: true
      },
      password:{
          type: String,
          required: true
      }
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)

/*validate: {
            validator: function(v, cb) {
              User.find({name: v}, function(err,docs){
                 cb(docs.length == 0);
              });
            },
            message: 'User already exists!'
      }*/