const path = require("path");
const fs = require("fs");
const Achivs = require("../models/achivments.js");

async function setAchivForm(req, res) {
  if (req.body.uploaded == true) {
    const achivIS = await Achivs.findByIdAndUpdate(req.params.id, {
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
    res.redirect("/stcolumbus/jaj/ekdara/admin#achiv");
  } else {
    try {
      const imagePath = path.join(
        __dirname,
        "../assets/AchivAvt",
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
      res.redirect(`/home/achivUpdate/${req.params.id}`);
    } catch (err) {
      res.redirect(`/home/achivUpdate/${req.params.id}`);
    }
  }
}

async function setAchivFormDet(req, res) {
  const achivIS = await Achivs.findById(req.params.id);
  // console.log(achivIS)
  const title = req.body.title || achivIS.title;
  const desc = req.body.desc || achivIS.desc;
  const prizeType = req.body.prizeType || achivIS.prizeType;
  const compDate = req.body.compDate || achivIS.comDate;

  const newData = {
    title,
    prizeType,
    desc,
    compDate,
  };
  // console.log(newData)

  const data = await Achivs.findByIdAndUpdate(
    req.params.id,
    { ...newData },
    { new: true }
  );
  // console.log(data)
  res.redirect("/stcolumbus/jaj/ekdara/admin#achiv");
}

function handelNewAchiv(req, res) {
  res.render("newAchiv.ejs");
}


async function handelNewAchivForm(req, res) {
  if (req.body.uploaded) {
    const { title, desc, prizeType, filename } = req.body;
    const newGal = await Achivs.create({
      title,
      desc,
      prizeType,
      img: filename,
    });
    // console.log(newGal);
    return res.redirect("/stcolumbus/jaj/ekdara/admin#achiv");
  } else {
    try {
      const imagePath = path.join(
        __dirname,
        "../assets/achivAvt",
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
      res.redirect(`/home/achiv/new`);
    } catch (err) {
      res.redirect(`/home/achiv/new`);
    }
  }
}
module.exports = {
  setAchivForm,
  setAchivFormDet,
  handelNewAchiv,
  handelNewAchivForm,
};
