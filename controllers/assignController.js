const { getAllAssignments, checkAssignmentExists, getAssignmentById, getAssignmentsByPolicyId, getAssignmentsByUserId, addAssignment, updateAssignmentById, deleteAssignmentById } = require('../models/assignModel');
const { getPolicyById } = require('../models/policyModel');
const { getUsersWithId } = require('../models/userModel');

const createAssignment = async (req, res) => {
    const user = req.user;
    console.log("user in add policy", user);
    if (user.role !== "agent") {
        return res.status(401).json({ message: "You are not authorized to add new policy" })
    }
    const { userId, policyId } = req.body;
    try {
        const users = await getUsersWithId(userId);
        if (!users) {
            return res.status(500).send({ error: `No users found with user id: ${userId}` });
        }
        const policy = await getPolicyById(policyId);
        if (!policy) {
            return res.status(500).send({ error: `no policy found for policy id: ${policyId}` });
        }
        const alreadyAssigned = await checkAssignmentExists(userId, policyId)
        if (alreadyAssigned) {
            return res.status(500).send({ error: `User has already subscribed to the same policy` });
        }
        const result = await addAssignment(userId, policyId);
        return res.status(201).send({ message: 'Assignment created successfully' });
    } catch (error) {
        return res.status(500).send({ error: `Failed to create assignment: ${error.message}` });
    }
};

const fetchAllAssignments = async (req, res) => {
    try {
        const assignments = await getAllAssignments();
        return res.status(200).send(assignments);
    } catch (error) {
        return res.status(500).send({ error: `Failed to fetch assignments: ${error.message}` });
    }
};

const fetchAssignmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const assignment = await getAssignmentById(id);
        if (assignment.length === 0) {
            return res.status(404).send({ message: 'Assignment not found' });
        } else {
            return res.status(200).send(assignment);
        }
    } catch (error) {
        return res.status(500).send({ error: `Failed to fetch assignment: ${error.message}` });
    }
};

const fetchAssignmentsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const assignments = await getAssignmentsByUserId(userId);
        return res.status(200).send(assignments);
    } catch (error) {
        return res.status(500).send({ error: `Failed to fetch assignments: ${error.message}` });
    }
};

const fetchAssignmentsByPolicy = async (req, res) => {
    const { policyId } = req.params;
    try {
        const assignments = await getAssignmentsByPolicyId(policyId);
        return res.status(200).send(assignments);
    } catch (error) {
        return res.status(500).send({ error: `Failed to fetch assignments: ${error.message}` });
    }
};

const modifyAssignmentById = async (req, res) => {
    const { id } = req.params;
    const { userId, policyId } = req.body;
    try {
        await updateAssignmentById(id, userId, policyId);
        return res.status(200).send({ message: 'Assignment updated successfully' });
    } catch (error) {
        return res.status(500).send({ error: `Failed to update assignment: ${error.message}` });
    }
};

const removeAssignmentById = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    console.log("user in add policy", user);
    if (user.role !== "admin") {
        return res.status(401).json({ message: "You are not authorized to add new policy" })
    }
    try {
        await deleteAssignmentById(id);
        return res.status(200).send({ message: 'Assignment deleted successfully' });
    } catch (error) {
        return res.status(500).send({ error: `Failed to delete assignment: ${error.message}` });
    }
};

module.exports = {
    createAssignment,
    fetchAllAssignments,
    fetchAssignmentById,
    fetchAssignmentsByUser,
    fetchAssignmentsByPolicy,
    modifyAssignmentById,
    removeAssignmentById
};
