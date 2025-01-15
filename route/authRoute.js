const express = require('express')
const { validateSignUpDetails, validateLoginDetails } = require('../middleware/authMiddleware')
const { signupUser, loginUser } = require('../controllers/authController')

const router = express.Router()

router.post('/signup', validateSignUpDetails, signupUser)
router.post('/login', validateLoginDetails, loginUser )

module.exports = router