const VERIFICATION_EMAIL_TEMPLATE = `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #6F2830;">
  <div style="background: linear-gradient(to right, #667eea 10%, #764ba2 60%, #6F2830 90%); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: white; margin: 0;">Reset Your Password</h1>
  </div>

  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. Use the verification code below to proceed:</p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #667eea;">{verificationCode}</span>
    </div>

    <p>Enter this code on the password reset page to create a new password.</p>
    <p>This OTP will remain valid for the next 10 minutes.</p>

    <p>If you didn’t request this, please ignore it. — your account remains secure.</p>

    <p>Best regards,<br>ST. Columbus Public school</p>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply to this email.</p>
  </div>
</body>
</html>
`;


module.exports =VERIFICATION_EMAIL_TEMPLATE;
