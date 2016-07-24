var
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema

  var trackSchema = new mongoose.Schema({
  title: String,
  sc_id: Number,
  url: String
  })
  userSchema = new Schema({
    local: {
      username: String,
      name: String,
      email: String,
      password: String,
      tracks: [trackSchema]
    }
  })

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password)
}

var User = mongoose.model('User', userSchema)

module.exports = User
