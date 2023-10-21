const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

const forgetPassword = async (req, res) => {
    const email = req.body.email;
    // console.log(email);

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.BREVO_API_KEY

    const tranEmailApi = new Sib.TransactionalEmailsApi()

    const sender = {
        email: 'uniquepandey@gmail.com',
        name: 'uniquepandey'
    }

    const receivers = [
        {
            email: 'rishabhpandey12798@gmail.com' //change it to user's email who forgets password
        }
    ]

    tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'forget password',
        textContent: ` your password is  `,
        // htmlContent: ` <h1> heading </h1> <p> pararagraph content </p>`,
    })
        .then(() => {
            res.status(200).json({ success: true, message: 'password successfully sent to you mail. check you inbox' });
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({success:false, message:'error in sending password mail', error:err})
        })

}

module.exports = {
    forgetPassword,
}