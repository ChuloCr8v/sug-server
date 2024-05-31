import nodemailer from "nodemailer";

export const sendMail = async ({ receiver, subject, message }) => {
  //intitialize nodemailer
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: receiver,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
