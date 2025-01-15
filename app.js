const express = require('express')
require('dotenv').config()
const { dbConnection } = require('./config/db.js')
const authRoute  = require('./route/authRoute.js');
const userRoute = require('./route/userRoute.js');
const policyRoute = require('./route/policyRoute.js');
const claimRoute = require('./route/claimRoute.js')
const assignPolicyRoute = require('./route/assignRoute.js')
const { createUsersTable } = require('./models/userModel.js');
const authenticateUser = require('./middleware/userValidate.js');
const { createPolicyTable } = require('./models/policyModel.js');
const { createAssignPolicyTable } = require('./models/assignModel.js');
const { createClaimsTable } = require('./models/claimModel.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())

const checkDBConnection = async()=>{
    try {
        await dbConnection();
        await createUsersTable();
        await createPolicyTable();
        await createAssignPolicyTable();
        await createClaimsTable()
        console.log("database connected successful");
        
    } catch (error) {
        console.log("error in connecting database", error?.message);
        
    }
}

checkDBConnection()

app.use('/auth', authRoute)
app.use('/user',authenticateUser, userRoute)
app.use('/policy', authenticateUser, policyRoute )
app.use('/claim', authenticateUser, claimRoute)
app.use('/assign-policy', authenticateUser, assignPolicyRoute)


app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})