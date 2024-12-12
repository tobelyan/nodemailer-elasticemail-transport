const nodemailer = require('nodemailer');
const elasticEmailTransport = require('./index');

const transporter = nodemailer.createTransport(
    elasticEmailTransport({
        apiKey: 'YOUR_ELASTIC_EMAIL_API_KEY',
    })
);

const mailOptions = {
    from: 'no-reply@example.com',
    to: 'recipient@example.com',
    subject: 'Hello from Elastic Email API',
    text: 'This is a plain text email!',
    html: '<p>This is an <b>HTML</b> email!</p>',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
