const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            isPremiumUser:false,
        })
            .then(user => {
                res.status(201).json({"success":true});
            })
            .catch(err => {
                // console.log(err.errors[0].message);
                res.status(500).json(err.errors[0].message);
            })
    })
}

function jwtToken(id){
    const token = jwt.sign({userId:id}, 'secret_key');
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
                bcrypt.compare(password, user[0].password, function(err, result){
                    if(result){
                        res.status(200).json({success:true, token:jwtToken(user[0].id)});
                    }else{
                        res.status(401).json("incorrect password");
                    }
                })
            }

        })
        .catch(err => {
            res.status(500).json(err);
        })
}

module.exports = {
    createUser,
    signinUser,
}