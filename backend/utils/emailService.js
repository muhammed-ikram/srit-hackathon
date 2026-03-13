const nodemailer = require('nodemailer');
const { getWelcomeTemplate, getLoginTemplate } = require('./emailTemplates');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendWelcomeEmail = async (email, username) => {
    try {
        const mailOptions = {
            from: `"CampusGuardian AI" <${process.env.EMAIL}>`,
            to: email,
            subject: 'Welcome to CampusGuardian AI!',
            html: getWelcomeTemplate(username)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent: ' + info.response);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error };
    }
};

const sendLoginEmail = async (email, username) => {
    try {
        const mailOptions = {
            from: `"CampusGuardian AI" <${process.env.EMAIL}>`,
            to: email,
            subject: 'New Login to CampusGuardian AI',
            html: getLoginTemplate(username)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Login notification email sent: ' + info.response);
        return { success: true, info };
    } catch (error) {
        console.error('Error sending login notification email:', error);
        return { success: false, error };
    }
};

module.exports = {
    sendWelcomeEmail,
    sendLoginEmail
};
