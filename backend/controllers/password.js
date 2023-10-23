const sequelize = require('../database/db');

const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/user');
const forgetPasswordRequest = require('../models/forgetPasswordRequests');
const { v4: uuidv4 } = require('uuid');

const sendResetLink = async (uuid) => {
    const email = req.body.email;
    console.log(email);

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
        htmlContent: ` <h1> reset your password </h1> <a href='http://localhost:3000/password/reset-password/${uuid}'> click here</a>`,
        params: {
            uuid: uuid,
        }
    })

}

const forgetPassword = async (req, res) => {

    try {
        const email = req.body.email;

        const user = await User.findOne({ where: { email: email } })

        // const userId = user.id;
        //changing it to uuid its secure
        // const uuid = Math.random();
        const uuid = uuidv4();
        console.log(uuid);

        const response = await user.createForgetPasswordRequest({
            id: uuid,
            isActive: true,
        })

        await sendResetLink(uuid);
        res.status(200).json({ success: true, message: 'password successfully sent to you mail. check you inbox' });

        // res.status(200).json({success: true});


    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'error in sending password mail', error: err })
    }
}

const resetPassword = async (req, res) => {
    const uuid = req.params.uuid;
    // console.log(uuid);
    try {
        const request = await forgetPasswordRequest.findOne({ where: { id: uuid } })
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
    // console.log(uuid);
    // console.log(newPassword);

    const t = await sequelize.transaction();
    try {
        const request = await forgetPasswordRequest.findOne({ where: { id: uuid } })
        if (request.isActive) {
            //update status
            await request.update({isActive:false },{ transaction:t});
            //also update password
            const user = await User.findOne({where:{id:request.userId}});

            await user.update({password: await encryptPassword(newPassword)},{transaction:t});
            res.status(200).json({ success: true, message: 'password updated successfully' });
        } else {
            res.status(500).json({ success: false, message: 'link is expired. Request a new one.' });
        }
        await t.commit();
    } catch (err) {
        await t.rollback();
        console.log(err);
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