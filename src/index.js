const express = require('express')
require('./database/mongoose')
const User = require('./models/User')

const app = express()
const port = process.env.PORT || 3000

//automatically pass incoming JSON to an object
app.use(express.json())

const errorSaveHandler = async (res, error) => {
  let answer = ''
  if (error.keyValue.username) {
    answer = `Nazwa użytkownika ${error.keyValue.username} jest już zajęta`
  } else if (error.keyValue.email) {
    answer = `Email  ${error.keyValue.email} jest już zajęty`
  }
  res.status(400).send(answer)
}

app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.send(user)
  } catch (error) {
    console.log('cos jest')
    errorSaveHandler(res, error)
  }
})

app.listen(port, () => {
  console.log('server is working on port ' + port)
})
