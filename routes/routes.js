const express = require("express");
const stcolumbus = express.Router();
const multer = require("multer");
const adminAvt = require("../../ddd/utils/updateAdmin.js");
const achivAvt = require("../../ddd/utils/updateAchiv.js");
const noticeAvt = require("../../ddd/utils/addNotice.js");
const galleyAvt = require("../../ddd/utils/updateGallery.js");
const path = require("path");
const fs = require("fs");
// const UserAdmin = require("../models/userAdmin.js");
const { checkAdminAsEditor } = require("../../ddd/middleware/checkAdmin.js");

const { setAdminForm, setAdminFormDet } = require("../../ddd/handler/handelAdmin.js");

const {
  setAchivForm,
  setAchivFormDet,
  handelNewAchiv,
  handelNewAchivForm,
} = require("../../ddd/handler/handelAchiv.js");

const {
  setGalleryForm,
  setGalleryFormDet,
  handelNewGallery,
  handelNewGalleryForm,
} = require("../handler/handelGallery.js");
const {
  handelNoticeForm,
  handelNoticeUpdateDet,
  handelNoticeUpdateImg,
} = require("../../ddd/handler/notice.js");

const Gallery = require("../../ddd/models/gallery.js");
const Achivments = require("../../ddd/models/achivments.js");
const Notice = require("../../ddd/models/notice.js");
// ==================================================
// admin Work
stcolumbus
  .route("/adminUpdate/:id")
  .get((req, res) => res.render("updateAdmin.ejs", { id: req.params.id }))
  .post(adminAvt.single("img"), setAdminForm);

stcolumbus
  .route("/adminUpdate/details/:id")
  .get((req, res) => res.render("updateAdminDet.ejs", { id: req.params.id }))
  .post(setAdminFormDet);

// ================================================
// Achiv work
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

stcolumbus
  .route("/achivDelete/:id")
  .get(checkAdminAsEditor, async (req, res) => {
    const data = await Achivments.findByIdAndDelete(req.params.id);

    if (data.img && data.img !== "/adminAvt/defaultAvt.png") {
      const imagePath = path.join(__dirname, "../assets", data.img); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }
    res.redirect("/stcolumbus/jaj/ekdara/admin#admin");
  });

stcolumbus
  .route("/achiv/new")
  .get(checkAdminAsEditor, handelNewAchiv)
  .post(checkAdminAsEditor, achivAvt.single("img"), handelNewAchivForm);

// =========================================
// Gallery work
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
  .route("/galleryDelete/:id")
  .get(checkAdminAsEditor, async (req, res) => {
    const data = await Gallery.findByIdAndDelete(req.params.id);

    if (data.img && data.img !== "/adminAvt/defaultAvt.png") {
      const imagePath = path.join(__dirname, "../assets", data.img); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }
    res.redirect("/stcolumbus/jaj/ekdara/admin#gallery");
  });

stcolumbus
  .route("/gallery/new")
  .get(checkAdminAsEditor, handelNewGallery)
  .post(checkAdminAsEditor, galleyAvt.single("img"), handelNewGalleryForm);

// ===================================================
//Notice Work
stcolumbus
  .route("/notice/new")
  .get(checkAdminAsEditor, (req, res) => res.render("createNotice.ejs"))
  .post(checkAdminAsEditor, noticeAvt.single("img"), handelNoticeForm);

stcolumbus
  .route("/noticeUpdate/details/:id")
  .get(checkAdminAsEditor, (req, res) => {
    res.render("noticeDetUpdate.ejs", { id: req.params.id });
  })
  .post(checkAdminAsEditor, handelNoticeUpdateDet);

stcolumbus
  .route("/noticeUpdate/:id")
  .get(checkAdminAsEditor, (req, res) =>
    res.render("noticeImgUpdate.ejs", { id: req.params.id })
  )
  .post(checkAdminAsEditor, noticeAvt.single("img"), handelNoticeUpdateImg);

stcolumbus
  .route("/noticeDelete/:id")
  .get(checkAdminAsEditor, async (req, res) => {
    const data = await Notice.findByIdAndDelete(req.params.id);

    if (data.img && data.img !== "/adminAvt/defaultAvt.png") {
      const imagePath = path.join(__dirname, "../assets", data.img); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }
    res.redirect("/stcolumbus/jaj/ekdara/admin#notice");
  });
// ===========================================================================

module.exports = stcolumbus;
