const Admins = require("../models/admins.js");
const path = require("path");
const fs = require("fs");


async function setAdminForm(req, res) {
  if (req.body.uploaded == true) {
    const useris = await Admins.findByIdAndUpdate(req.params.id, {
      img: req.body.filename,
    }).then((AdminIs) => {
      console.log(AdminIs.img);
      if (AdminIs.img && AdminIs.img !== "/adminAvt/defaultAvt.png") {
        try {
          const imagePath = path.join(__dirname, "../assets", AdminIs.img); // Adjust based on your storage setup
          // Delete the image file
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            } else {
              console.log("Image deleted successfully");
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
    res.redirect("/stcolumbus/jaj/ekdara/admin#admin");
  } else {
    try {
      const imagePath = path.join(
        __dirname,
        "../assets/adminAvt",
        req.body.filename
      ); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
      res.redirect(`/home/adminUpdate/${req.params.id}`);
    } catch (err) {
      res.redirect(`/home/adminUpdate/${req.params.id}`);
    }
  }
}

async function setAdminFormDet(req, res) {
  const userIs = await Admins.findById(req.params.id);
  const name = req.body.name || userIs.name;
  const uniqId = req.body.uniqId || userIs.unqId;
  const email = req.body.email || userIs.email;
  const position = req.body.position || userIs.position;
  const age = req.body.age || userIs.age;
  const gender = req.body.gender || userIs.gender;
  const quli = req.body.quli || userIs.quli;
  const joingDate = req.body.joingDate || userIs.joingDate;
  const newData = {
    uniqId,
    name,
    email,
    position,
    age,
    gender,
    quli,
    joingDate,
  };

  const data = await Admins.findByIdAndUpdate(
    req.params.id,
    { ...newData },
    { new: true }
  );
  res.redirect("/stcolumbus/jaj/ekdara/admin#admin");
}

module.exports = {
  setAdminForm,
  setAdminFormDet,
};
