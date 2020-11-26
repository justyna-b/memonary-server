const jwt = require('jsonwebtoken')
const User = require('../models/User')

//validate the token being provided 
//find the user in db
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'ihavenoideawhyitworks')
        //find user with provided id and check if he has valid token
        const user = await User.findOne({'_id' : decoded._id, 'tokens.token' : token})
        if (!user) {
            throw new Error()
        }
        //if success, give root handler access to the fetched from the db user
        //it is fetched so root handler does not have to do that again it waste resource and time
        //add the property onto request to store it and the root handler will be able to access it later on
        req.user = user
        console.log("token token: " ,token, decoded)
        next()
    } catch (error) {
        //send back json object with error property of error
        res.status(403).send({errorMsg: 'the user is not authenticated', error: error})
        next()
    }
}

module.exports = auth