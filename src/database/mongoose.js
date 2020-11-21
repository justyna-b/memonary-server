const mongoose = require('mongoose')

const dbName = 'memonary'
const connectionURL = `mongodb://127.0.0.1:27017/${dbName}`

try {
  mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
} catch (error) {
    handleError(error)
}