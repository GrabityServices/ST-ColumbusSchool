const {sendVerificationEmail, sendEditVerificationEmail}=require('../mail/emails.js')
async function sendOtp (email,unqid, edit=false) {
  try {
        const varificationCode = Math.floor(
          1000 + Math.random() * 9000
        ).toString();
        
        if (edit) {
          console.log("sending edit verification email")
            await sendEditVerificationEmail(varificationCode,"dkumar06545@gmail.com",unqid)
        } else {
          console.log("sending verification email")
            await sendVerificationEmail(varificationCode,"dkumar06545@gmail.com",unqid)
        }
        return varificationCode;
  } catch (err) {
    console.log("fail to mail")
    return false;
  }
};

module.exports=sendOtp;