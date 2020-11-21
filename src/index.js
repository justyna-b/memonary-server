const express = require('express')
require('./database/mongoose')
const User = require('./models/User')

const app = express()
const port = process.env.PORT || 3000

//automatically pass incoming JSON to an object
app.use(express.json())

app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

app.listen(port, () => {
    console.log("server is working on port " +port)
})
