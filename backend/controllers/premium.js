const Razorpay = require('razorpay');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const Order = require('../models/order');

const purchasePremium = (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret,
        });

        var options = {
            amount: 70000,
            currency: 'INR',
        }

        rzp.orders.create(options, (err, order) => {
            if(err){
                throw new Error(JSON.stringify(err));
            }
            
            let newOrder = new Order({
                userId: req.user._id,
                order_id: order.id,
                status: 'PENDING',
            })
            newOrder.save()
                .then(()=>{
                 return res.status(201).json({order,key_id: process.env.key_id});
                })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'error in purchasing premium', error: err });
    }
}

async function updatePaymentStatus(req, res){
   

        const {order_id, payment_id} = req.body;
        Order.updateOne({order_id: order_id}, {$set: {payment_id: payment_id, status: 'SUCCESSFUL'}})
            .then(()=>{
                req.user.isPremiumUser = true;
                return req.user.save();
            })
            .then(()=>{
                res.status(200).json({success:true, message:'successfully purchased premium membership', token: jwt.sign({ userId: req.user.id, isPremiumUser:true }, 'secret_key') });
            })
            .catch(err=>{
                console.log('error in updating payment status', err);
                res.status(500).json({success:false, message:'error in updating status', error: err});
            })
}

module.exports = {
    purchasePremium,
    updatePaymentStatus,
}