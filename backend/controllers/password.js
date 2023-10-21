const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/user');
const forgetPasswordRequest = require('../models/forgetPasswordRequests');

const sendResetLink = async (uuid) => {
    // const email = req.body.email;
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
            email: 'rishabhpandey12798@gmail.com' //change it to user's email who forgets password
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

        const userId = user.id;
        //change it to uuid its secure
        const uuid = Math.random();

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

const changePassword = async (req, res) => {
    const uuid = req.params.uuid;
    const newPassword = req.body.newPassword;
    // console.log(uuid);
    // console.log(newPassword);

    try {
        const request = await forgetPasswordRequest.findOne({ where: { id: uuid } })
        if (request.isActive) {
            //update status
            await request.update({isActive:false });
            //also update password
            const user = await User.findOne({where:{id:request.userId}});
            //........encrypt the password
            await user.update({password: await encryptPassword(newPassword)});
            res.status(200).json({ success: true, message: 'password updated successfully' });
        } else {
            res.status(500).json({ success: false, message: 'link is expired. Request a new one.' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'error in updating password', error: err });
    }
}

async function encryptPassword(password){
    // let encryptedPassword ;
    // bcrypt.hash(password, 15, function(err, hash) {
    //     // Store hash in your password DB.
    //     encryptedPassword = hash;
    // });
    // console.log(encryptedPassword);
    // return encryptedPassword;
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