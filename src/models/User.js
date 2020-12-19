const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
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
  },
  tokens: [
    {
      token: {
        type: String,
        required: false
      }
    }
  ]
})

userSchema.virtual('user_folders', {
  ref: 'Folder',
  localField: '_id',
  foreignField: 'owner'
})

//hash the plain text pasword before save to db
userSchema.pre('save', async function (next) {
  try {
    const user = this
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
      console.log('hashed bef save', user.password)
    }
    next()
  } catch (error) {
    console.log(error)
  }
})

userSchema.statics.findByCredentials = async (email, givenPwd) => {
  const user = await User.findOne({ email })

  try {
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
  } catch (error) {
    console.log(error)
  }
}

//return public data, without password and tokens from another sessions
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

// need this bind so not an arrow function
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign(
    { _id: user._id.toString() },
    'ihavenoideawhyitworks',
    { expiresIn: '3 hours' }
  )
  try {
    user.tokens = user.tokens.concat({ token })
    await user.save()
  } catch (error) {
    console.log(error)
  }
  return token
}

const User = mongoose.model('User', userSchema)

module.exports = User
