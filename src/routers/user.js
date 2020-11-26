const express = require('express')
const router = new express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

const errorSaveHandler = (res, error) => {
  let answer = ''
  if (error.errors) {
      console.log(error)
      res.status(400).send(error.message)
  } else if (error.keyValue.username) {
      res.status(400).send(`Nazwa użytkownika: ${error.keyValue.username} jest już zajęta`)
  } else if (error.keyValue.email) {
      res.status(400).send(`Istnieje już konto na adres: ${error.keyValue.email}`)
  } else {
      res.status(400).send(error)
  }
}

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(403).send(error)
    }
})

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.send(user)
  } catch (error) {
    errorSaveHandler(res, error)
  }
})

router.get('/get-all', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/get/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (error) {
        res.status(403).send("you are not authenticated")
    }
})


module.exports = router