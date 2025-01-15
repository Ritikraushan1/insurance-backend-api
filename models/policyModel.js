const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');

const createPolicyTable = async () => {
    const query = `
    IF NOT EXISTS (
        SELECT * 
        FROM sysobjects 
        WHERE name = 'RitPolicy' AND xtype = 'U'
    )
    BEGIN
        CREATE TABLE RitPolicy (
            id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
            policyId UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
            policyName NVARCHAR(100) NOT NULL,
            premiumAmount NVARCHAR(255) NOT NULL,
            duration DECIMAL(18, 2) NULL
        );
    END;
    `;
    try {
        await sql.query(query);
    } catch (error) {
        console.log(`Error in creating policy table, ${error}`);
    }
};

const insertNewPolicy = async (policy) => {
    console.log("Adding policy with data", policy);
    const policyId = uuidv4();
    const query = `
        INSERT INTO RitPolicy(policyId, policyName, premiumAmount, duration)
        VALUES (@policyId, @policyName, @premiumAmount, @duration);
        SELECT * FROM RitPolicy WHERE policyId = @policyId;
    `;

    try {
        const request = new sql.Request();
                
        // Using .input() to pass parameters securely
        request.input('policyId', sql.UniqueIdentifier, policyId);
        request.input('policyName', sql.NVarChar, policy.policyName);
        request.input('premiumAmount', sql.NVarChar, policy.premiumAmount);
        request.input('duration', sql.Decimal, policy.duration);
                
        // Execute the query and fetch the newly added policy
        const result = await request.query(query);
        console.log("Result after insertion", result.recordset[0]);
        return result.recordset[0]; // Return the newly inserted policy
    } catch (error) {
        console.log("Error in inserting policy:", error);
    }
};

// Function to get a policy by ID
const getPolicyById = async (policyId) => {
    const query = `
        SELECT * FROM RitPolicy
        WHERE policyId = @policyId;
    `;
    try {
        const request = new sql.Request();
        request.input('policyId', sql.UniqueIdentifier, policyId);

        const result = await request.query(query);
        if (result.recordset.length > 0) {
            return result.recordset[0];
        } else {
            console.log("Policy not found");
            return null;
        }
    } catch (error) {
        console.log("Error in fetching policy by ID:", error);
    }
};

const getAllPolicies = async () => {
    const query = `
        SELECT * FROM RitPolicy;
    `;
    try {
        const request = new sql.Request();
        const result = await request.query(query);

        if (result.recordset.length > 0) {
            return result.recordset;
        } else {
            console.log("No policies found");
            return [];
        }
    } catch (error) {
        console.log("Error in fetching all policies:", error);
        throw error; // Re-throw the error to handle it higher up if needed
    }
};

// Function to update a policy by ID
const updatePolicyWithId = async (policyId, policy) => {
    const query = `
        UPDATE RitPolicy
        SET policyName = @policyName, 
            premiumAmount = @premiumAmount, 
            duration = @duration
        WHERE policyId = @policyId;
        SELECT * FROM RitPolicy WHERE policyId = @policyId;
    `;

    try {
        const request = new sql.Request();
        
        request.input('policyId', sql.UniqueIdentifier, policyId);
        request.input('policyName', sql.NVarChar, policy.policyName);
        request.input('premiumAmount', sql.NVarChar, policy.premiumAmount);
        request.input('duration', sql.Decimal, policy.duration);

        const result = await request.query(query);
        console.log("Policy after update:", result.recordset[0]);
        return result.recordset[0]; // Return updated policy
    } catch (error) {
        console.log("Error in updating policy:", error);
    }
};

// Function to delete a policy by ID
const deletePolicyWithId = async (policyId) => {
    const query = `
        DELETE FROM RitPolicy
        WHERE policyId = @policyId;
    `;
    
    try {
        const request = new sql.Request();
        request.input('policyId', sql.UniqueIdentifier, policyId);

        const result = await request.query(query);
        if (result.rowsAffected > 0) {
            console.log("Policy deleted successfully.");
            return { message: 'Policy deleted successfully.' };
        } else {
            console.log("Policy not found.");
            return { message: 'Policy not found.' };
        }
    } catch (error) {
        console.log("Error in deleting policy:", error);
    }
};

module.exports = { createPolicyTable, insertNewPolicy, getPolicyById, getAllPolicies, updatePolicyWithId, deletePolicyWithId };
