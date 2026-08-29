const MARKS_EDIT_VERIFICATION_EMAIL_TEMPLATE = `

<div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
    color: #333;
    line-height: 1.6;
">

    <div style="
        background: #667eea;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 8px 8px 0 0;
    ">

        <h2 style="margin:0;">
            Marks Editing Verification
        </h2>

    </div>


    <div style="
        padding: 25px;
        border: 1px solid #ddd;
        border-top: none;
    ">

        <p>Hello,</p>


        <p>
            A request was made to modify student
            marks in the
            <strong>ST. Columbus Public School</strong>
            administration system.
        </p>


        <table style="
            width:100%;
            border-collapse:collapse;
            margin:20px 0;
        ">

            <tr>

                <td style="
                    padding:10px;
                    border:1px solid #ddd;
                    font-weight:bold;
                ">
                    Teacher ID
                </td>

                <td style="
                    padding:10px;
                    border:1px solid #ddd;
                ">
                    {teacherId}
                </td>

            </tr>


            <tr>

                <td style="
                    padding:10px;
                    border:1px solid #ddd;
                    font-weight:bold;
                ">
                    Student ID
                </td>

                <td style="
                    padding:10px;
                    border:1px solid #ddd;
                ">
                    {studentId}
                </td>

            </tr>

        </table>


        <p>
            Enter this verification code to authorize
            the marks modification:
        </p>


        <div style="
            text-align:center;
            margin:30px 0;
        ">

            <span style="
                display:inline-block;
                font-size:34px;
                font-weight:bold;
                letter-spacing:7px;
                color:#667eea;
                background:#f4f6ff;
                padding:15px 28px;
                border-radius:8px;
            ">

                {verificationCode}

            </span>

        </div>


        <p>
            This OTP is valid for
            <strong>5 minutes</strong>
            and can only be used once.
        </p>


        <p>
            If you did not request this operation,
            please contact the school administrator.
        </p>


        <hr style="
            border:none;
            border-top:1px solid #ddd;
            margin:25px 0;
        ">


        <p style="
            font-size:12px;
            color:#777;
        ">

            This is an automated security message.
            Please do not reply to this email.

        </p>


        <p>
            Regards,<br>
            <strong>ST. Columbus Public School</strong>
        </p>

    </div>

</div>

`;

module.exports =
    MARKS_EDIT_VERIFICATION_EMAIL_TEMPLATE;