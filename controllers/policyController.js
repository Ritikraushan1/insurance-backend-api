const { getPolicyById, getAllPolicies, insertNewPolicy, updatePolicyWithId, deletePolicyWithId } = require('../models/policyModel.js');

async function addNewPolicy(req, res) {
    try {
        const user = req.user;
        console.log("user in add policy", user);
        if(user.role!=="admin"){
            return res.status(401).json({message:"You are not authorized to add new policy"})
        }
        
        const policy = req.body; 
        const newPolicy = await insertNewPolicy(policy);

        return res.status(201).json({
            message: "Policy added successfully",
            policy: newPolicy,
        });
    } catch (error) {
        console.error("Error in adding policy:", error);
        return res.status(500).json({
            message: "Error in adding policy",
            error: error.message,
        });
    }
}

async function getPolicy(req, res) {
    try {
        const { id: policyId } = req.params;  
        const policy = await getPolicyById(policyId);

        if (policy) {
            res.status(200).json({
                message: "Policy found",
                policy: policy,
            });
        } else {
            res.status(404).json({
                message: "Policy not found",
            });
        }
    } catch (error) {
        console.error("Error in fetching policy:", error);
        res.status(500).json({
            message: "Error in fetching policy",
            error: error.message,
        });
    }
}

async function getAllPolicy(req, res) {
    try {
        const policies = await getAllPolicies(); 

        if (policies && policies.length > 0) {
            res.status(200).json({
                message: "Policies found",
                policies: policies,
            });
        } else {
            res.status(404).json({
                message: "No policies found",
            });
        }
    } catch (error) {
        console.error("Error in fetching policies:", error);
        res.status(500).json({
            message: "Error in fetching policies",
            error: error.message,
        });
    }
}


async function updatePolicy(req, res) {
    try {
        const user = req.user;
        console.log("user in update policy", user);
        if(user.role!=="admin"){
            return res.status(401).json({message:"You are not authorized to update new policy"})
        }
        const { id: policyId } = req.params;  
        const policyData = req.body; 
        const updatedPolicy = await updatePolicyWithId(policyId, policyData);

        if (updatedPolicy) {
            res.status(200).json({
                message: "Policy updated successfully",
                policy: updatedPolicy,
            });
        } else {
            res.status(404).json({
                message: "Policy not found",
            });
        }
    } catch (error) {
        console.error("Error in updating policy:", error);
        res.status(500).json({
            message: "Error in updating policy",
            error: error.message,
        });
    }
}

async function deletePolicy(req, res) {
    try {
        const user = req.user;
        console.log("user in delete policy", user);
        if(user.role!=="admin"){
            return res.status(401).json({message:"You are not authorized to delete new policy"})
        }
        const { id: policyId } = req.params;  
        const result = await deletePolicyWithId(policyId);

        if (result) {
            res.status(200).json({
                message: "Policy deleted successfully",
                result: result,
            });
        } else {
            res.status(404).json({
                message: "Policy not found",
            });
        }
    } catch (error) {
        console.error("Error in deleting policy:", error);
        res.status(500).json({
            message: "Error in deleting policy",
            error: error.message,
        });
    }
}

module.exports=  { addNewPolicy, getPolicy, getAllPolicy, updatePolicy, deletePolicy };
