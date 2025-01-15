const express = require('express')
const { createClaim,
    modifyClaim,
    removeClaim,
    getClaim,
    fetchAllClaims,
    fetchClaimsByUser,
    updateClaimStatus } = require('../controllers/claimController')

const router = express.Router()

router.post('/',createClaim)
router.put('/:id', modifyClaim)
router.delete('/:id', removeClaim)
router.get('/:id', getClaim)
router.get('/', fetchAllClaims)
router.get('/users/:userId', fetchClaimsByUser)
router.patch('/:id', updateClaimStatus)

module.exports = router