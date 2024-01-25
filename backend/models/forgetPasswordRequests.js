

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgetPasswordRequestSchema  = new Schema({
    id: String,
    userId: String,
    isActive: Boolean,
})

module.exports = mongoose.model('forgetPasswordRequest', forgetPasswordRequestSchema);