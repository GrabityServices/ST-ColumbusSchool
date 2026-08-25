const MARKS_EDIT_VERIFICATION_EMAIL_TEMPLATE = `

<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">

  <h2 style="text-align: center; color: #667eea;">
    Marks Editing Verification
  </h2>

  <p>Hello,</p>

  <p>
    A request was made to access the <strong>Marks Editing</strong> section
    of the <strong>ST. Columbus Public School</strong> administration panel.
  </p>

  <p>
    To continue and edit student marks, please enter the verification code
    shown below:
  </p>

  <div style="text-align: center; margin: 30px 0;">
    <span style="
      display: inline-block;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #667eea;
      background: #f4f6ff;
      padding: 15px 25px;
      border-radius: 8px;
    ">
      {verificationCode}
    </span>
  </div>

  <p>
    This verification code is valid for <strong>5 minutes</strong>.
  </p>

  <p>
    <strong>Important:</strong> This verification is required before any
    student marks can be modified.
  </p>

  <p>
    If you did not request access to edit marks, please ignore this email.
    Your account remains secure.
  </p>

  <p>
    Best regards,<br>
    <strong>ST. Columbus Public School</strong>
  </p>

</div>

`;

module.exports = MARKS_EDIT_VERIFICATION_EMAIL_TEMPLATE;