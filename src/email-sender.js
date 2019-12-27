const nodeMailer = require("nodemailer");

function sendMail(req, res) {
  const { name, email, first_name, last_name, relationship } = req;
  const msg = `Hey, ${name}! Your ${relationship}, ${first_name} ${last_name} is having a bday today!`;
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, //true for 465 port, false for other ports
    auth: {
      user: "bestie.secretary@gmail.com",
      pass: "89297060Kz"
    }
  });

  let mailOptions = {
    from: "bestie.secretary@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Importand reminder", // Subject line
    text: `Hey, ${name}! Your ${relationship}, ${first_name} ${last_name} is having a bday today!`, // plain text body
    html: `<b>${msg}</b>` // html body
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
module.exports = sendMail;
