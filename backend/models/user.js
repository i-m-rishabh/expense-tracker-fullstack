
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
            username:{
                type:String, 
                required: true,
                
            },
            email:{
                type: String,
                required: true, 
                
            },
            phone:{
                type:String,
                required: true,
            },
            password:{
                type:String,
                required: true,
            },
            isPremiumUser:{
                type:Boolean,
                required: false,
            },
            totalExpense:{
                type:Number,
                required: false,
            },
            
});

module.exports = mongoose.model('User', userSchema);