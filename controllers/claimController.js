const {
    addClaim,
    updateClaimById,
    deleteClaimById,
    getClaimById,
    getAllClaims,
    getClaimsByUserId,
    patchClaimStatusById
} = require('../models/claimModel');


const createClaim = async (req, res) => {
    try {
        const claimData = req.body;
        const newClaim = await addClaim(claimData.userId, claimData.policyId, claimData.status, claimData.reason);
        return res.status(201).json({ success: true, data: newClaim });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const modifyClaim = async (req, res) => {
    try {
        const user = req.user;
        console.log("user in modify claim", user);
        if(user.role!=="admin"){
            return res.status(401).json({message:"You are not authorized to modify claim"})
        }
        const { id } = req.params;
        const updatedData = req.body;
        const updatedClaim = await updateClaimById(id, updatedData);
        if (!updatedClaim) {
            return res.status(404).json({ success: false, message: 'Claim not found' });
        }
        return res.status(200).json({ success: true, data: updatedClaim });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const removeClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteClaimById(id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Claim not found' });
        }
        return res.status(200).json({ success: true, message: 'Claim deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const claim = await getClaimById(id);
        if (!claim) {
            return res.status(404).json({ success: false, message: 'Claim not found' });
        }
        return res.status(200).json({ success: true, data: claim });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const fetchAllClaims = async (req, res) => {
    try {
        const claims = await getAllClaims();
        return res.status(200).json({ success: true, data: claims });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const fetchClaimsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const claims = await getClaimsByUserId(userId);
        if (!claims || claims.length === 0) {
            return res.status(404).json({ success: false, message: 'No claims found for this user' });
        }
        return res.status(200).json({ success: true, data: claims });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateClaimStatus = async (req, res) => {
    try {
        const user = req.user;
        console.log("user in update claim", user);
        if(user.role!=="admin"){
            return res.status(401).json({message:"You are not authorized to update claim"})
        }
        const { id } = req.params;
        const { status } = req.body;
        const updatedClaim = await patchClaimStatusById(id, status);
        if (!updatedClaim) {
            return res.status(404).json({ success: false, message: 'Claim not found' });
        }
        return res.status(200).json({ success: true, data: updatedClaim });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createClaim,
    modifyClaim,
    removeClaim,
    getClaim,
    fetchAllClaims,
    fetchClaimsByUser,
    updateClaimStatus
};
