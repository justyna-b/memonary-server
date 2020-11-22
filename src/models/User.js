const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('this is not valid email')
      }
    },
    trim: true,
    lowercase: true,
    unique: true,
    autoIndex: true
  },
  username: {
    type: String,
    minlength: 3,
    required: true,
    trim: true,
    //mongoose returns code 11000 if error, and 400 http code => bad request
    unique: true,
    autoIndex: true
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    required: true,
    validate (value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('password can not contains "password" word')
      }
    }
  }
})

//hash the plain text pasword before save to db
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
    console.log('hashed bef save', user.password)
  }
  next()
})

userSchema.statics.findByCredentials = async (email, givenPwd) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Błędny email. Nie ma takiego użytkownika.')
  }
  console.log(user.password)
  const isMatch = await bcrypt.compare(givenPwd, user.password)
  console.log(isMatch)
  if (!isMatch) {
    throw new Error('bad credentials')
  }
  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
