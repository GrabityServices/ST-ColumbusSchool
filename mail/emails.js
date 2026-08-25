const VERIFICATION_EMAIL_TEMPLATE=require("./emailTemp.js")
const EDIT_VERIFICATION_EMAIL_TEMPLATE=require("./emailEditTemp.js")
const sendEmail=require("./user.mailtrap.js")
 async function sendVerificationEmail (verificationToke,email,unqid){
  try {
    const response=await sendEmail(
      VERIFICATION_EMAIL_TEMPLATE .replace('{verificationCode}', verificationToke)
    .replace('{accountId}', unqid),
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

 async function sendEditVerificationEmail (verificationToke,email,unqid){
  try {
    const response=await sendEmail(
      EDIT_VERIFICATION_EMAIL_TEMPLATE .replace('{verificationCode}', verificationToke)
    .replace('{accountId}', unqid),
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





module.exports={sendVerificationEmail, sendEditVerificationEmail};
