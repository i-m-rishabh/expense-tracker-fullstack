const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const S3services = require('../services/S3services');
// const AWS = require('aws-sdk');

require('dotenv').config();

async function createUser(req, res) {
    const { username, email, phone, password } = req.body;

    //encrypting password
    const saltrounds = 10;

    bcrypt.hash(password, saltrounds, function (err, hash) {
        
        const user = new User({
            username: username,
            email: email,
            phone: phone,
            password: hash,
            isPremiumUser: false,
            totalExpense: 0,
        })
        user.save()
        .then((user)=>{
            res.status(201).json({success: true})
        })
        .catch(err=>{
            console.log('error in creating user', err);
            res.status(500).json({success: false, err: err});
        })
    })
    
}

function jwtToken(id, isPremiumUser) {
    const token = jwt.sign({ userId: id, isPremiumUser: isPremiumUser }, 'secret_key');
    return token;
}

function signinUser(req, res) {
    const { email, password } = req.body;
    
    User.findOne({email: email})
        .then(user => {
           
            if(!user){
                res.status(401).json('email does not exist');
            }else{
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result) {
                        res.status(200).json({ success: true, token: jwtToken(user._id, user.isPremiumUser) });
                    } else {
                        res.status(401).json("incorrect password");
                    }
                })
            }
        })
        .catch(err => {
            console.log('error in signing in', err);
            res.status(500).json(err);
        })
}

async function getUsers(req, res) {

    User.find({})
        .then((users)=>{
                     if (!users) {
                        throw new Error('error in getting userDetails');
                    }
                    const userDetails = users.map(user => {
                        return [user.username, user.totalExpense];
                    });
                    res.status(200).json({ success: true, data: userDetails });
        })
        .catch(err=>{
            console.log('error in getting all users list', err);
            res.status(500).json({success: false, message: 'error in getting user details', error: err});
        })
}

// async function downloadReport(req, res) {
//     try {
//         const expenses = await req.user.getExpenses();
//         const stringifiedExpenses = JSON.stringify(expenses);
//         // console.log(stringifiedExpenses);
//         const response = await S3services.uploadToS3('my-expense-tracker', stringifiedExpenses, `expense-${req.user.id}-${new Date}.txt`);
//         // console.log(response);
//         await req.user.createFile({
//             name: `expense-${req.user.id}-${new Date}.txt`,
//             Url: response,
//             date: new Date, 
//         });
        
//         res.status(200).json({ success: true, URL: response });
//     } catch (err) {
//         console.log('something went wrong: ', err);
//         res.status(500).json({ success: false, message: 'something went wrong', error: err });
//     }
// }

module.exports = {
    createUser,
    signinUser,
    getUsers,
    // downloadReport,
}