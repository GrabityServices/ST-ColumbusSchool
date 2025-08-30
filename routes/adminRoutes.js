const express = require("express");
const adminroute = express.Router();
const adminManagment = express.Router();
const adminAccountAvt = require("../utils/updateAdminAccountImg.js");
// ======================accpunt Handlers==============
const {
  handleStAdmin,
  hadnleLoginForm,
  handleForgotForm,
  hadnleSignupForm,
} = require("../handler/stcolumbusadmin.js");
//==============UserAdmin Updates Handler=============================
const {
  handleUpdateAdminImg,
  handleUpdateAdminDet,
  handleDeleteAdmin,
} = require("../handler/stcolumbusadmin.js");
//==================admin work=================================
adminroute.route("").get(handleStAdmin);
adminroute
  .route("/update/img/:id")
  .get((req, res) =>
    res.render("updateAdminAccountImg.ejs", { id: req.params.id })
  )
  .post(adminAccountAvt.single("img"), handleUpdateAdminImg);

adminroute
  .route("/update/det/:id")
  .get((req, res) =>
    res.render("updateAdminAccountDet.ejs", { id: req.params.id })
  )
  .post(handleUpdateAdminDet);

  adminroute.route('/delete/:id').get(handleDeleteAdmin)
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
  .get((req, res) => res.render("signupForm.ejs"))
  .post(hadnleSignupForm);

adminManagment.route("/forgot/userid").get((req, res) => res.send("By Id"));
adminManagment.route("/forgot/email").get((req, res) => res.send("By email"));
adminManagment
  .route("/forgot/pass")
  .get((req, res) => res.render("forgotAdminPass.ejs", { user: false }))
  .post(handleForgotForm);

adminManagment.route("/change/pass").get((req, res) => {
  res.render("forgotAdminPass.ejs", { user: true });
});

module.exports = { adminroute, adminManagment };
