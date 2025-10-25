const { MailtrapClient } = require("mailtrap");

module.exports = async function sendEmail(
  message,
  sub,
  cate,
  UserEmail = process.env.MAILTRAP_DEFAULTS
) {
  try {
    const token=process.env.MAILTRAP_TOKEN;
    const client = new MailtrapClient({
      token
    });

    const sender = {
      email: process.env.MAILTRAP_SENDER,
      name: "App Validate",
    };

    const recipients = [{ email: UserEmail }];
    await client.send({
      from: sender,
      to: recipients,
      subject: sub,
      html: message,
      category: cate,
    });

    console.log("Email sent successfully");
    return 1;
  } catch (error) {
    console.error("Mailtrap error:",error.message);
    return 0;
  }
};
