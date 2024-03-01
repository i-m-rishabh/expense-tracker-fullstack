const sequelize = require('../database/db');

const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/user');
const forgetPasswordRequest = require('../models/forgetPasswordRequests');
const { v4: uuidv4 } = require('uuid');
const ForgetPasswordRequest = require('../models/forgetPasswordRequests');

const sendResetLink = async (uuid) => {
    const email = req.body.email;
    // console.log(email);

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY

    const tranEmailApi = new Sib.TransactionalEmailsApi()

    const sender = {
        email: 'expense-tracker@gmail.com',
        name: 'uniquepandey'
    }

    const receivers = [
        {
            // email: 'rishabhpandey12798@gmail.com' //change it to user's email who forgets password
            email: email,
        }
    ]

    return tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'forget password',
        // textContent: ` your password is  `,
        htmlContent: ` <h1> reset your password </h1> <a href='${serverEndPoint}/password/reset-password/${uuid}'> click here</a>`,
        params: {
            uuid: uuid,
        }
    })

}

const forgetPassword = async (req, res) => {

    try {
        const email = req.body.email;

        const user = await User.findOne({ email: email })

        const uuid = uuidv4();
        
        const request = new ForgetPasswordRequest({
            id: uuid,
            isActive: true,
            userId: req.user._id,
        })

        await request.save();

        await sendResetLink(uuid);
        res.status(200).json({ success: true, message: 'password successfully sent to you mail. check you inbox' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'error in sending password mail', error: err })
    }
}

const resetPassword = async (req, res) => {
    const uuid = req.params.uuid;
    // console.log(uuid);
    try {
        const request = await ForgetPasswordRequest.findOne({ id: uuid })
        const form = `
        <form action='/password/reset-password/${uuid}', method='POST'>
            <label>new Password </label>
            <input type='text' name='newPassword'/>
            <br>
            <button type='submit'> reset password </button>
        </form>
        `;
        res.set('Content-Type', 'text/html');
        res.send(form);

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'someting went wrong', error: err });
    }
}

//this function will be triggers when user will submit the new-password form
const changePassword = async (req, res) => {
    const uuid = req.params.uuid;
    const newPassword = req.body.newPassword;

    try {
        const request = await ForgetPasswordRequest.findOne({ id: uuid })
        if (request.isActive) {
            //update status
            request.isActive = false,
            await request.save();
            //also update password
            req.user.password = await encryptPassword(newPassword);
            await req.user.save();
            res.status(200).json({ success: true, message: 'password updated successfully' });
        } else {
            res.status(500).json({ success: false, message: 'link is expired. Request a new one.' });
        }
    } catch (err) {
        console.log('error in updating user password', err);
        res.status(500).json({ success: false, message: 'error in updating password', error: err });
    }
}

async function encryptPassword(password){
    try{
        const hash = await bcrypt.hash(password, 10);
        console.log(hash);
        return hash;
    } catch(err){
        console.log(err);
    }
}

module.exports = {
    forgetPassword,
    resetPassword,
    changePassword,
}