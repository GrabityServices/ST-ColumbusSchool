const VERIFICATION_EMAIL_TEMPLATE=require("../mailtrap/emailTemp.js")
const sendEmail=require("../mailtrap/user.mailtrap.js")
 async function sendVerificationEmail (verificationToke,email){
  try {
    const response=await sendEmail(
      VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToke
      ),
      "Verify Through Email",
      "Account Verification",
      email
    );
    if(!response){
      throw({error:"Unsuccess to send email"})
    }
  } catch (error) {
    throw new Error(`Error sending verification email: ${error}`);
  }
};


module.exports=sendVerificationEmail;
