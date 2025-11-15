const express = require("express");
const adminroute = express.Router();
const adminManagment = express.Router();
const { adminAccountAvt, saveAdminAccountAvt } = require("../utils/updateAdminAccountImg.js");
const { checkAdminAsSuperadmin } = require("../middleware/checkAdmin.js");
const jwt = require("jsonwebtoken")
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
const UserAdmin = require("../models/userAdmin.js");
const modifiedemail = require("../utils/modifyemail.js");
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
  .post(adminAccountAvt.single("img"), saveAdminAccountAvt, handleUpdateAdminImg);

adminroute
  .route("/update/det/:id")
  .get(async (req, res) => {
    const data = await jwt.verify(req.cookies.stadminis, process.env.JWTKEYIS)
    let fname = ""
    let lname = ""
    try {
      const name = data.name
      const newName = name.split(" ")
      fname = newName[0]
      lname = newName[1]
    } catch (err) {
      console.log(err)
    }
    res.render("updateAdminAccountDet.ejs", { id: req.params.id, pre: [fname, lname, data.email] })
  })
  .post(handleUpdateAdminDet);

adminroute
  .route("/update/det/superadmin/:id")
  .get(checkAdminAsSuperadmin, (req, res) =>
    res.render("updateBySuperAdmin.ejs", { id: req.params.id })
  )
  .post(checkAdminAsSuperadmin, hadnleUpdateBySuperAdmin);

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

adminManagment
  .route("/verify/email/:id")
  .get(async (req, res) => {
    let otp = await getOtp(req.params.id);
    if (!otp) {
      const unqid = await UserAdmin.findOne({ email: req.params.id }).select('uniqId');
      otp = await handleForgot(req.params.id, unqid.uniqId)
      if (otp) {
        storeOtp(req.params.id, otp)
        const email = req.params.id;
        const modified = await modifiedemail(email)
        res.render("Otp.ejs", { email: modified, reenter: false })
      }
      else {
        res.redirect("http://localhost:3000/stcolumbus/admin/manage/forgot/pass")
      }
    } else {
      const email = req.params.id;
      const modified = await modifiedemail(email)
      res.render("Otp.ejs", { email: modified, reenter: false })
    }
  })
  .post(async (req, res) => {
    const id = req.params.id
    const otp = await getOtp(id)
    if (otp == req.body.fotp) {
      res.render("forgotAdminPass.ejs", {
        user: true,
        idOrEmail: id
      });
    } else {
      const email = req.params.id;
      const modified = await modifiedemail(email)

      res.render("Otp.ejs", { email: modified, reenter: true })
    }
  })

adminManagment.route("/forgot/pass/setpass").post(setNewPass)


adminManagment.route("/change/pass").get((req, res) => {
  res.render("forgotAdminPass.ejs", { user: true });
});


adminManagment.route("/logout").get((req, res) => {
  res.cookie("stadminis", null, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: new Date(Date.now()),
  });
  res.redirect('/stcolumbus/admin/manage/login')
})

module.exports = { adminroute, adminManagment };