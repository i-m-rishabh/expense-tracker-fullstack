const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authorization = async(req, res, next) => {
    try{
        const token = req.header('Authorization');
    //verify the token 
    if(!token){
        throw new Error('not authorized');
    }
    const decodedToken = jwt.verify(token, 'secret_key');
    // console.log(decodedToken.userId);
    User.findById(decodedToken.userId)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
        res.json({success:false, response:'error in authorization', error:err});
    })
    } catch(err){
        res.json({success:false, message: err});
    }
    
}

module.exports = {
    authorization,
};