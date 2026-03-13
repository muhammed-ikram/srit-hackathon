const getWelcomeTemplate = (username) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
            padding: 60px 40px;
            text-align: center;
            background: linear-gradient(to bottom, rgba(59, 130, 246, 0.1), transparent);
        }
        .logo {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.025em;
            background: linear-gradient(to right, #60a5fa, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 24px;
        }
        .content {
            padding: 0 40px 60px;
            text-align: center;
        }
        h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #ffffff;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #94a3b8;
            margin-bottom: 32px;
        }
        .button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(to right, #3b82f6, #8b5cf6);
            color: #ffffff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s ease;
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }
        .footer {
            padding: 32px 40px;
            background: rgba(0, 0, 0, 0.2);
            text-align: center;
            font-size: 14px;
            color: #64748b;
        }
        .divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.05);
            margin: 40px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CampusGuardian AI</div>
            <h1>Welcome to the Family, ${username}!</h1>
        </div>
        <div class="content">
            <p>We're absolutely thrilled to have you join our community. CampusGuardian AI is more than just a platform; it's a place where you can grow, share, and connect.</p>
            <a href="http://localhost:5173/home" class="button">Go to Dashboard</a>
            <div class="divider"></div>
            <p style="font-size: 14px;">If you have any questions, feel free to reply to this email. Our team is always here to help!</p>
        </div>
        <div class="footer">
            &copy; 2026 CampusGuardian AI Inc. All rights reserved.<br>
            Designed with love for our amazing users.
        </div>
    </div>
</body>
</html>
`;

const getLoginTemplate = (username) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .header {
            padding: 60px 40px;
            text-align: center;
            background: linear-gradient(to bottom, rgba(16, 185, 129, 0.1), transparent);
        }
        .logo {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.025em;
            background: linear-gradient(to right, #10b981, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 24px;
        }
        .content {
            padding: 0 40px 60px;
            text-align: center;
        }
        h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #ffffff;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #94a3b8;
            margin-bottom: 32px;
        }
        .button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(to right, #10b981, #3b82f6);
            color: #ffffff;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s ease;
            box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
        }
        .footer {
            padding: 32px 40px;
            background: rgba(0, 0, 0, 0.2);
            text-align: center;
            font-size: 14px;
            color: #64748b;
        }
        .security-note {
            font-size: 12px;
            color: #475569;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CampusGuardian AI</div>
            <h1>Welcome back, ${username}!</h1>
        </div>
        <div class="content">
            <p>You've successfully logged into your account. We're glad to see you again! Explore what's new on CampusGuardian AI today.</p>
            <a href="http://localhost:5173/home" class="button">Go to Dashboard</a>
            <p class="security-note">If this wasn't you, please secure your account immediately or contact our support.</p>
        </div>
        <div class="footer">
            &copy; 2026 CampusGuardian AI Inc. All rights reserved.<br>
            Secure and simple authentication.
        </div>
    </div>
</body>
</html>
`;

module.exports = {
    getWelcomeTemplate,
    getLoginTemplate
};
