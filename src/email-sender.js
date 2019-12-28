const nodeMailer = require("nodemailer");
const { EMAIL_PASSWORD } = require("./config");

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "bestie.secretary@gmail.com",
    pass: EMAIL_PASSWORD
  }
});

const sendEmails = {
  sendEmailReminder: function(req, res) {
    const { name, email, first_name, last_name, relationship } = req;
    const msg = `Hey, ${name}! Your ${relationship}, ${first_name} ${last_name} is having a bday today!`;

    let mailOptions = {
      from: "bestie.secretary@gmail.com",
      to: email,
      subject: "Importand reminder",
      text: `${msg}`,
      html: `<b>${msg}</b>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ success: false });
      } else {
        res.status(200).send({ success: true });
      }
    });
  },
  sendEmailVerification: function(req, res) {
    const { verification_code, email } = req;
    const msg = `Welcome to Bestie! Please click on the <a href="http://localhost:8000/verification?code=${verification_code}">Link</a> to verify your email!`;
    let mailOptions = {
      from: "bestie.secretary@gmail.com",
      to: email,
      subject: "Verify your email address",
      text: `${msg}`,
      html: `<b>${msg}</b>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({ success: false });
      } else {
        res.status(200).send({ success: true });
      }
    });
  }
};

module.exports = sendEmails;