const Razorpay = require('razorpay');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const Order = require('../models/order');
//adding transactions
const sequelize = require('../database/db');

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
            req.user.createOrder({order_id:order.id, status:'PENDING'})
            .then(()=>{
                return res.status(201).json({order,key_id: process.env.key_id});
            })
        })

    } catch (err) {
        res.status(500).json({ success: false, message: 'error in purchasing premium', error: err });
    }
}

async function updatePaymentStatus(req, res){
    const t = sequelize.transaction();
    try{
        const {order_id, payment_id} = req.body;
        const order = await Order.findOne({where:{order_id}}, {transaction: t})
    
        const [response1, response2] = await Promise.all([
            order.update({payment_id:payment_id, status:'SUCCESSFUL'}, {transaction: t}),
            req.user.update({isPremiumUser:true}),
        ]);
        await t.commit();
        res.status(200).json({success:true, message:'successfully purchased premium membership', token: jwt.sign({ userId: req.user.id, isPremiumUser:true }, 'secret_key') });

    }catch(err){
        console.log(err);
        await t.rollback();
        res.status(500).json({success:false, message:'error in updating status', error: err});
    }
}

module.exports = {
    purchasePremium,
    updatePaymentStatus,
}