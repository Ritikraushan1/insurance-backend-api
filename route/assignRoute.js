const express = require('express')
const { createAssignment,
    fetchAllAssignments,
    fetchAssignmentById,
    fetchAssignmentsByUser,
    fetchAssignmentsByPolicy,
    modifyAssignmentById,
    removeAssignmentById } = require('../controllers/assignController')

const router = express.Router()

router.post('/', createAssignment)
router.get('/', fetchAllAssignments)
router.get('/:id', fetchAssignmentById)
router.get('/for-users/:userId', fetchAssignmentsByUser)
router.get('/for-policy/:policyId', fetchAssignmentsByPolicy)
router.put('/:id', modifyAssignmentById)
router.delete('/:id', removeAssignmentById)


module.exports = router