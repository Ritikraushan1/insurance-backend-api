const express = require('express')
const {getUserDetails, updateUserDetails, deleteUserDetails} = require('../controllers/userController')

const router = express.Router()

router.get('/', getUserDetails)
router.put('/', updateUserDetails)
router.delete('/', deleteUserDetails)

module.exports = router