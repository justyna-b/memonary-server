const express = require('express')
const router = new express.Router()
const Folder = require('../models/Folder')
const auth = require('../middleware/auth')
const cors = require('cors')

router.post('/folder/create', auth, async (req, res) => {
  const folder = new Folder({
      ...req.body,
      owner: req.user._id
  })
  try {
    await folder.save()
    res.status(201).send('Twoj folder został dodany!')
  } catch (error) {
    res.status(403).send({
      error: error,
      error_msg: 'cos nie poszło'
    })
  }
})

//get folder by id/name
router.get('/folders/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const folder = await Folder.findOne({_id, owner: req.user._id})
        if(!folder) {
            res.status(404).send('nie ma')
        }
        res.status(200).send(folder)
    } catch (error) {
        res.status(500).send(error)
    }
})

//get all folders
router.get('/folders', auth, async (req, res) => {
    try {
        const folders = await Folder.find({owner: req.user._id})
        if(!folders) {
            res.status(404).send('nie ma nic')
        }
        res.status(200).send(folders)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get('/folder/get-all-folders', auth, async (req, res) => {
  try {
    const folders = await Folder.findByCredentials(req.body.email)

    res.status(200).send(folders)
  } catch (error) {
    res.status(403).send('you are not authenticated')
  }
})

module.exports = router
