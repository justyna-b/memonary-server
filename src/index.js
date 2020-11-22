const express = require('express')
require('./database/mongoose')
const User = require('./models/User')

const app = express()
const port = process.env.PORT || 3000

//automatically pass incoming JSON to an object
app.use(express.json())

const errorSaveHandler = async (res, error) => {
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

app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(403).send(error)
    }
})

app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.send(user)
  } catch (error) {
    errorSaveHandler(res, error)
  }
})

app.listen(port, () => {
  console.log('server is working on port ' + port)
})
