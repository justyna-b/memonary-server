const express = require('express')
require('./database/mongoose')
const User = require('./models/User')
const userRouter  = require('./routers/user')

const app = express()
const port = process.env.PORT || 3000

//automatically pass incoming JSON to an object
app.use(express.json())
app.use(userRouter)


app.listen(port, () => {
  console.log('server is working on port ' + port)
})
