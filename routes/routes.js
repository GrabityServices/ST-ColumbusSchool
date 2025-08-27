const express = require("express");
const stcolumbus = express.Router();
const multer = require("multer");
const adminAvt = require("../utils/updateAdmin.js");
const achivAvt = require("../utils/updateAchiv.js");
const galleyAvt = require("../utils/updateGallery.js");

const update = multer({ dest: "assets/adminAvt/" });

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
stcolumbus.route("/admin").get(handelGetAdmin);

stcolumbus.route("/adminroe").get(getAdmin);
stcolumbus
  .route("/adminUpdate/:id")
  .get((req, res) => res.render("updateAdmin.ejs", { id: req.params.id }))
  .post(adminAvt.single("img"), setAdminForm);

stcolumbus
  .route("/adminUpdate/details/:id")
  .get((req, res) => res.render("updateAdminDet.ejs", { id: req.params.id }))
  .post(setAdminFormDet);

// ================================================
stcolumbus.route("/achiv").get(handelGetAchiv);
stcolumbus.route("/achivroe").get(getAchiv);
stcolumbus
  .route("/achivUpdate/:id")
  .get((req, res) => res.render("updateAchiv.ejs", { id: req.params.id }))
  .post(achivAvt.single("img"), setAchivForm);

stcolumbus
  .route("/achivUpdate/details/:id")
  .get((req, res) => res.render("updateAchivDet.ejs", { id: req.params.id }))
  .post(setAchivFormDet);

// =========================================
stcolumbus.route("/gallery").get(handelGetGallery);
stcolumbus.route("/galleryore").get(handelGallery);

stcolumbus
  .route("/galleryUpdate/:id")
  .get((req, res) => res.render("updateGalley.ejs", { id: req.params.id }))
  .post(galleyAvt.single("img"), setGalleryForm);

stcolumbus
  .route("/galleryUpdate/details/:id")
  .get((req, res) => res.render("galleryUpdateDet.ejs", { id: req.params.id }))
  .post(setGalleryFormDet);

stcolumbus
  .route("/gallery/new")
  .get(handelNewGallery)
  .post(galleyAvt.single("img"),handelNewGalleryForm);
module.exports = stcolumbus;
