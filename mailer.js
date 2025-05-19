// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',                  // literal 'apikey' string
    pass: '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'   // replace with your SendGrid API key
  }
});

function sendRegistrationEmail(toEmail, name, webinarLink) {
  const mailOptions = {
    from: ' <bhavya.pothala@squareroots.ai>',  // replace with your verified sender email
    to: toEmail,
    subject: 'Webinar Registration Confirmation',
    html: `<p>Hi ${name},</p>
           <p>Thanks for registering! Join the webinar here:</p>
           <a href="${webinarLink}">${webinarLink}</a>`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendRegistrationEmail;
