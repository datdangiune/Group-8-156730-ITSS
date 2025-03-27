const nodemailer = require("nodemailer");
require("dotenv").config()
const sendMail = async ({email, html})=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_NAME,
          pass: process.env.APP_PASSWORD,
        }
      })
      let info = await transporter.sendMail({
        from: '"Shop của Hà" <ShopHa@shopha.com>', // sender address
        to: email, // list of receivers
        subject: "Change Password", // Subject line
        html: html, // html body
      })
      return info
}
module.exports = sendMail