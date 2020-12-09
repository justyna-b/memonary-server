const mongoose = require('mongoose')

const folderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  folder_name: {
    type: String,
    required: true,
    trim: true
  },
  words: [
    {
      pl_word: {
        type: String,
        required: true,
        trim: true
      },
      foreign_word: {
        type: String,
        required: true,
        trim: true
      }
    }
  ]
})

folderSchema.statics.findByCredentials = async (owner, folder_name = null) => {
  const folders = await Folder.find({ owner })
  try {
    if (!folders) {
      throw new Error('nie ma folderów.')
    }
    return folders
  } catch (error) {
    console.log(error)
  }
}

const Folder = mongoose.model('Folder', folderSchema)

module.exports = Folder
