const nodeMailer = require("nodemailer");
const { EMAIL_PASSWORD } = require("./config");
const hbs = require("nodemailer-express-handlebars");

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "bestie.secretary@gmail.com",
    pass: EMAIL_PASSWORD
  }
});

let layout = "";
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: "src/nodemailer/templates/",
    layoutsDir: "src/nodemailer/templates/",
    defaultLayout: layout
  },
  viewPath: "src/nodemailer/templates/",
  extName: ".hbs"
};

transporter.use("compile", hbs(handlebarOptions));

const sendEmails = {
  sendEmailReminder: function(req, res) {
    layout = "bday-reminder.hbs";
    const { name, email, first_name, last_name, relationship } = req;
    const msg = `Hey, ${name}! Don’t forget to say Happy Birthday to your ${relationship} - ${first_name} ${last_name} today!`;

    let mailOptions = {
      from: '"BESTIE" bestie.secretary@gmail.com',
      to: email,
      subject: "Bday reminder",
      text: "Email from Bestie",
      template: "bday-reminder",
      context: { msg }
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
  sendEmailInitialVerification: function(req, res) {
    layout = "initial-verification.hbs";
    const { verification_code, email } = req;
    let mailOptions = {
      from: '"BESTIE" bestie.secretary@gmail.com',
      to: email,
      subject: "Verify your email address",
      text: "Email from Bestie",
      template: "initial-verification",
      context: { verification_code }
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
  sendEmailChangeEmail: function(req, res) {
    layout = "change-email.hbs";
    const { verification_code, email } = req;
    let mailOptions = {
      from: '"BESTIE" bestie.secretary@gmail.com',
      to: email,
      subject: "Verify your new email address",
      text: "Email from Bestie",
      template: "change-email",
      context: { verification_code }
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
