const express = require("express");
const stcolumbus = express.Router();
const multer = require("multer");
const adminAvt = require("../utils/updateAdmin.js");
const achivAvt = require("../utils/updateAchiv.js");
const galleyAvt = require("../utils/updateGallery.js");
// const UserAdmin = require("../models/userAdmin.js");
const {
  checkAdminAsEditor,
} = require("../middleware/checkAdmin.js");

const {
  handelGetAdmin,
  handelGetAchiv,
  handelGetGallery,
} = require("../handler/get.js");
const {
  getAdmin,
  setAdminForm,
  setAdminFormDet,
} = require("../handler/handelAdmin.js");

const {
  getAchiv,
  setAchivForm,
  setAchivFormDet,
} = require("../handler/handelAchiv.js");

const {
  handelGallery,
  setGalleryForm,
  setGalleryFormDet,
  handelNewGallery,
  handelNewGalleryForm,
} = require("../handler/handelGallery.js");
// ==================================================
stcolumbus.route("/").get((req, res) => res.redirect("/home/admin"));
stcolumbus.route("/admin").get(handelGetAdmin);
stcolumbus.route("/adminroe").get(getAdmin);
stcolumbus
  .route("/adminUpdate/:id")
  .get( (req, res) =>
    res.render("updateAdmin.ejs", { id: req.params.id })
  )
  .post( adminAvt.single("img"), setAdminForm);

stcolumbus
  .route("/adminUpdate/details/:id")
  .get( (req, res) =>
    res.render("updateAdminDet.ejs", { id: req.params.id })
  )
  .post( setAdminFormDet);

// ================================================
stcolumbus.route("/achiv").get(handelGetAchiv);
stcolumbus.route("/achivroe").get(getAchiv);
stcolumbus
  .route("/achivUpdate/:id")
  .get(checkAdminAsEditor, (req, res) =>
    res.render("updateAchiv.ejs", { id: req.params.id })
  )
  .post(checkAdminAsEditor, achivAvt.single("img"), setAchivForm);

stcolumbus
  .route("/achivUpdate/details/:id")
  .get(checkAdminAsEditor, (req, res) =>
    res.render("updateAchivDet.ejs", { id: req.params.id })
  )
  .post(checkAdminAsEditor, setAchivFormDet);

// =========================================
stcolumbus.route("/gallery").get(handelGetGallery);
stcolumbus.route("/galleryore").get(handelGallery);

stcolumbus
  .route("/galleryUpdate/:id")
  .get(checkAdminAsEditor, (req, res) =>
    res.render("updateGalley.ejs", { id: req.params.id })
  )
  .post(checkAdminAsEditor, galleyAvt.single("img"), setGalleryForm);

stcolumbus
  .route("/galleryUpdate/details/:id")
  .get(checkAdminAsEditor, (req, res) =>
    res.render("galleryUpdateDet.ejs", { id: req.params.id })
  )
  .post(checkAdminAsEditor, setGalleryFormDet);

stcolumbus
  .route("/gallery/new")
  .get(checkAdminAsEditor, handelNewGallery)
  .post(checkAdminAsEditor, galleyAvt.single("img"), handelNewGalleryForm);

// ======================================AdminFunctions======================================

module.exports = stcolumbus;
