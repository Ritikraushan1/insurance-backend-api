const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { insertUserIntoTable, findUserByEmail } = require('../models/userModel');


const signupUser = async(req, res)=>{
    console.log("route reaching here signup");
    
    const {name, email, income, password, age, role} = req.body;
    const isExistingUser = await findUserByEmail(email);
    console.log();
    
    if(isExistingUser){
        return res.status(400).json({error: "user already exists"})
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user=  {
        name: name,
        email: email,
        income: income,
        password: hashedPassword,
        age: age,
        role
    }
    
    try {
        const addUsers = await insertUserIntoTable(user);
        if (addUsers && addUsers.error) {
            return res.status(400).json({ error: addUsers.error });
        }
        const returnUser = {
            id: addUsers.userId,
            email: addUsers.email,
            name: addUsers.name,
            income: addUsers.income,
            age: addUsers.age,
            role: addUsers.role
        }
        const token = jwt.sign(returnUser,process.env.JWT_SECRET,{
            expiresIn:'2h'
        } )
        const result = {
            user: returnUser,
            token
        }
        return res.status(201).json(result)
    } catch (error) {
        return res.status(400).json({error: "Error in signup with users"})
    }
}

const loginUser = async(req, res)=>{
    const {email, password} = req.body;
    try {
        
        const isExistingUser = await findUserByEmail(email);
        console.log();
        console.log(isExistingUser);
        
        
        if(!isExistingUser){
            return res.status(400).json({error: "User Not Found"})
        }
        const passwordMatch = await bcrypt.compare(password, isExistingUser.password);
            
        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }
    
        const returnUser={
            id: isExistingUser.userId,
            name: isExistingUser.name,
            email: isExistingUser.email,
            income: isExistingUser.income,
            age: isExistingUser.age
        }
        const token = jwt.sign(returnUser, process.env.JWT_SECRET, {
            expiresIn:'2h'
        })
        return res.status(200).json({
            message: "Login successful",
            token,
            user: returnUser,
        });
    } catch (error) {
        console.log(`error in logging in ${error}`);
        
    }
}

module.exports = {signupUser, loginUser}