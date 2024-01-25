
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order_id: String,
    status: String,
    payment_id: String,
});

module.exports = mongoose.model('Order', orderSchema);