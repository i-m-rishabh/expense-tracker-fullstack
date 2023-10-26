const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

require('dotenv').config();

async function createUser(req, res) {
    const { username, email, phone, password } = req.body;
    // console.log(username, email, phone, password);

    //encrypting password
    const saltrounds = 10;

    bcrypt.hash(password, saltrounds, function (err, hash) {
        User.create({
            username: username,
            email: email,
            phone: phone,
            password: hash,
            isPremiumUser: false,
            totalExpense: 0,
        })
            .then(user => {
                res.status(201).json({ "success": true });
            })
            .catch(err => {
                // console.log(err.errors[0].message);
                res.status(500).json(err.errors[0].message);
            })
    })
}

function jwtToken(id, isPremiumUser) {
    const token = jwt.sign({ userId: id, isPremiumUser: isPremiumUser }, 'secret_key');
    return token;
}

function signinUser(req, res) {
    const { email, password } = req.body;
    User.findAll({
        where: {
            email: email
        }
    })
        .then(user => {
            if (user.length === 0) {
                res.status(401).json('email does not exist');
            } else {
                bcrypt.compare(password, user[0].password, function (err, result) {
                    if (result) {
                        // res.status(200).json({ success: true, token: jwtToken(user[0].id), isPremiumUser: user[0].isPremiumUser });
                        res.status(200).json({ success: true, token: jwtToken(user[0].id, user[0].isPremiumUser) });
                    } else {
                        res.status(401).json("incorrect password");
                    }
                })
            }

        })
        .catch(err => {
            res.status(500).json(err);
        })
}

async function getUsers(req, res) {
    try {
        const users = await User.findAll()
        if (!users) {
            throw new Error('error in getting userDetails');
        }
        // console.log(users);
        const userDetails = users.map(user => {
            return [user.username, user.totalExpense];
        });
        res.status(200).json({ success: true, data: userDetails });
    } catch (err) {
        console.log(err);
        res.json(500).json({ success: false, message: 'error in getting userDetails', error: err });
    }
    // res.json({success:true});
}

async function downloadReport(req, res) {
    try {
        const expenses = await req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);
        // console.log(stringifiedExpenses);
        const response = await uploadToS3('my-expense-tracker', stringifiedExpenses, `expense-${req.user.id}-${new Date}.txt`);
        console.log(response);
        res.status(200).json({success:true, URL:response});
    } catch (err) {
        console.log('something went wrong: ', err);
        res.status(500).json({success:false,message:'something went wrong', error:err});
    }
}


async function uploadToS3 (BucketName, data, fileName) {
    const s3BucketName = BucketName;
    const IAM_USER_KEY = process.env.IAM_USER_ACCESS_KEY_ID;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET_ACCESS_KEY;
    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        region: 'us-east-2',
    });

    const params = {
        Bucket: s3BucketName,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    };

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('error occured');
                reject(err);
            } else {
                console.log('success');
                resolve(s3response.Location);
            }
        });
    });
}

module.exports = {
    createUser,
    signinUser,
    getUsers,
    downloadReport,
}