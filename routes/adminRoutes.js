const express = require("express");
const adminroute = express.Router();
const adminManagment = express.Router();
const adminAccountAvt = require("../utils/updateAdminAccountImg.js");
const { checkAdminAsSuperadmin } = require("../middleware/checkAdmin.js");
// ======================accpunt Handlers==============
const {
  handleStAdmin,
  hadnleLoginForm,
  handleForgotForm,
  hadnleSignupForm,
  setNewPass,
} = require("../handler/stcolumbusadmin.js");
//==============UserAdmin Updates Handler=============================
const {
  handleUpdateAdminImg,
  handleUpdateAdminDet,
  handleDeleteAdmin,
  hadnleUpdateBySuperAdmin,
} = require("../handler/stcolumbusadmin.js");
const handleForgot = require("../handler/auth.controller.js");
const { storeOtp, getOtp } = require("../utils/redis.js");
//==================admin work=================================
adminroute.route("").get(handleStAdmin);
adminroute
  .route("/update/img/:id")
  .get((req, res) =>
    res.render("takeFile.ejs", {
      id: req.params.id,
      adminUpdate: false,
      userAdminUpdate: true,
      galleryUpdate: false,
      noticeUpdate: false,
    })
  )
  .post(adminAccountAvt.single("img"), handleUpdateAdminImg);

adminroute
  .route("/update/det/:id")
  .get((req, res) =>
    res.render("updateAdminAccountDet.ejs", { id: req.params.id })
  )
  .post(handleUpdateAdminDet);

adminroute
  .route("/update/det/superadmin/:id")
  .get(checkAdminAsSuperadmin,(req, res) =>
    res.render("updateBySuperAdmin.ejs", { id: req.params.id })
  )
  .post(checkAdminAsSuperadmin,hadnleUpdateBySuperAdmin);

adminroute.route("/delete/:id").get(checkAdminAsSuperadmin, handleDeleteAdmin);


//=======================admin login logout section=========================================
adminManagment
  .route("/login")
  .get((req, res) => {
    if (req.cookies.stadminis) {
      return res.redirect("/stcolumbus/jaj/ekdara/admin");
    }
    res.render("loginForm.ejs");
  })
  .post(hadnleLoginForm);

adminManagment
  .route("/signup")
  .get(checkAdminAsSuperadmin, (req, res) => res.render("signupForm.ejs"))
  .post(checkAdminAsSuperadmin, hadnleSignupForm);

adminManagment
  .route("/forgot/pass")
  .get((req, res) => res.render("forgotAdminPass.ejs", { user: false }))
  .post(handleForgotForm);

  adminManagment.route("/verify/email/:id")
  .get(async (req,res)=>{
    let otp=await getOtp(req.params.id);
    if(!otp){
      otp=await handleForgot(req.params.id)
      if(otp){
        storeOtp(req.params.id,otp)
        res.render("Otp.ejs",{email:req.params.id,reenter:false})
      }
      else{
        res.redirect("http://localhost:3000/stcolumbus/admin/manage/forgot/pass")
      }
    }else{
      res.render("Otp.ejs",{email:req.params.id,reenter:false})
    }
  })
  .post(async (req,res)=>{
    const id=req.params.id
    const otp=await getOtp(id)
    if(otp==req.body.fotp){
      res.render("forgotAdminPass.ejs", {
          user: true,
          idOrEmail:id
        });
    }else{
          res.render("Otp.ejs",{email:id,reenter:true})
    }
  })
  
adminManagment.route("/forgot/pass/setpass").post(setNewPass)


adminManagment.route("/change/pass").get((req, res) => {
  res.render("forgotAdminPass.ejs", { user: true });
});


adminManagment.route("/logout").get((req,res)=>{
  res.cookie("stadminis", null, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: new Date(Date.now()),
  });
  res.redirect('/stcolumbus/admin/manage/login')
})

module.exports = { adminroute, adminManagment };
