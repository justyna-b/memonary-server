const express = require('express')
const router = new express.Router()
const User = require('../models/User')
const auth = require('../middleware/auth')
const cors = require('cors')

const errorSaveHandler = (res, error) => {
  let answer = ''
  if (error.errors) {
    console.log(error)
    res.status(400).send(error.message)
  } else if (error.keyValue.username) {
    res
      .status(400)
      .send(`Nazwa użytkownika: ${error.keyValue.username} jest już zajęta`)
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
    res.status(200).send({ user, token })
  } catch (error) {
    res.status(403).send(errorSaveHandler(res, error))
  }
})

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res
      .status(201)
      .send({ user: user, msg: 'Zostałeś zarejestrowany. Zaloguj się' })
  } catch (error) {
    res
      .status(403)
      .send({
        error: error,
        msg: 'Rejestracja się nie powiodła. Spróbuj jeszcze raz'
      })
    // errorSaveHandler(res, error)
  }
})

//logout current session
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      //return true when the token that you're currently looking at isn't the one that was used for authentication, while true keep in tokens array if false stop filtering and remove
      return token.token !== req.token
    })
    await req.user.save()
    res.status(200).send('you are logged out')
  } catch (error) {
    res.status(500).send()
  }
})

//logout of all sessions
router.post('/users/logout-all', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).send()
  } catch (error) {
    res.status(500).send()
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
    res.status(403).send('you are not authenticated')
  }
})

module.exports = router
