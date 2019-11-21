const nodemailer = require('nodemailer');
const logger = require('../logs/logger');

// create mail transporter
function sendEmail() {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mariustudorache39@gmail.com',
      pass: 'pass'
    }
  })

  var mailOptions = {
    from: '"Marius Tudorache" <mariustudorache39@gmail.com>',
    to: 'email@gmail.com',
    subject: 'Precios cryptomonedas actualizados',
    text: 'Este es un mensaje de prueba ',
    html: '<b>Hey there! </b><br>{emailData}<br /> ',

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    }
    logger.info('Email enviado: %s', info.messageId);
  });
}

module.exports = sendEmail;
