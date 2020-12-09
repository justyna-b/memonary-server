const express = require('express')
const cors = require('cors')

require('./database/mongoose')
const User = require('./models/User')
const Folder = require('./models/Folder')
const userRouter  = require('./routers/user')
const folderRouter = require('./routers/folder')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
//automatically pass incoming JSON to an object
app.use(express.json())
app.use(userRouter)
app.use(folderRouter)


app.listen(port, () => {
  console.log('server is working on port ' + port)
})

