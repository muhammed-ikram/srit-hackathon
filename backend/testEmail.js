require('dotenv').config();
const { sendWelcomeEmail, sendLoginEmail } = require('./utils/emailService');

const testEmail = async () => {
    console.log('Testing Welcome Email...');
    const welcomeResult = await sendWelcomeEmail('test@example.com', 'TestUser');
    console.log('Welcome Result:', welcomeResult);

    console.log('\nTesting Login Email...');
    const loginResult = await sendLoginEmail('test@example.com', 'TestUser');
    console.log('Login Result:', loginResult);
};

testEmail().then(() => {
    console.log('\nVerification script finished.');
    process.exit(0);
}).catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
