const express = require("express");
const stcolumbus = express.Router();
const multer =require('multer')
const avatarupload=require('../utils/updateAdmin.js')

const update =multer({dest:'assets/adminAvt/'})

const handelGet = require("../handler/get.js");
const {
  getAdmin,
  setAdminForm,
  setAdminFormDet
} = require("../handler/handelAdmin.js");
stcolumbus.route("/").get(handelGet);
stcolumbus.route("/admin").get(getAdmin);
stcolumbus
  .route("/adminUpdate/:id")
  .get((req, res) => res.render("updateAdmin.ejs",{id:req.params.id}))
  .post(avatarupload.single('img'),setAdminForm)

  stcolumbus.route('/adminUpdate/details/:id')
  .get((req, res) => res.render("updateAdminDet.ejs",{id:req.params.id}))
  .post(setAdminFormDet)
module.exports = stcolumbus;
