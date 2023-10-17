const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authorization = async(req, res, next) => {
    const token = req.header('Authorization');
    //verify the token 
    const decodedToken = jwt.verify(token, 'secret_key');
    // console.log(decodedToken.userId);
    User.findByPk(decodedToken.userId)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
        res.json({success:false, response:'error in authorization', error:err});
    })
    
}

module.exports = {
    authorization,

};