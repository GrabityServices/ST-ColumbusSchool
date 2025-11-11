const sendVerificationEmail=require('../mail/emails.js')
async function handleForgot (email,unqid){
  try {
        const varificationCode = Math.floor(
          1000 + Math.random() * 9000
        ).toString();
        
        await sendVerificationEmail(varificationCode,email,unqid)
        return varificationCode;
  } catch (err) {
    console.log("fail to mail")
    return false;
  }
};

module.exports=handleForgot;