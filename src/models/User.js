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

userSchema.pre('save', async function (next) {
  const user = this
  console.log('just before saving')
  if (user.isModified('password')) {
    user.password = await bcrypt.hash('password', 8)
  }
  next()
})

userSchema.post('save', function (error, doc, next) {
  const user = this
  if (error.name === 'MongoError' && error.code === 11000) {
    if (error.keyValue.username === user.username) {
      console.log('This username is taken')
      next(new Error('Taki użytkownik już istnieje'))
    } else if (error.keyValue.email === user.email) {
      console.log('There exists an account with that email')
      next(new Error('Taki email już istnieje'))
    }
  } else {
    console.log('Something else went wrong')
    next(error)
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
