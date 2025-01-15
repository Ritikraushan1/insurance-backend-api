const express = require('express')
const { addNewPolicy, getPolicy, getAllPolicy, updatePolicy, deletePolicy } = require('../controllers/policyController')

const router = express.Router()

router.post('/', addNewPolicy)
router.get('/', getAllPolicy)
router.get('/:id', getPolicy)
router.put('/:id', updatePolicy)
router.delete('/:id', deletePolicy)

module.exports = router