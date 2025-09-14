const Notice = require("../models/notice.js");
const fs = require("fs");
const path = require("path");

async function handelNoticeForm(req, res) {
  if (req.file) {
    if (req.body.uploaded) {
      const notice = await Notice.create({
        title: req.body.title,
        mess: req.body.mess,
        img: req.body.filename,
      });
      res.send(notice);
    } else {
      // ================delete file=================
      const imagePath = path.join(
        __dirname,
        "../assets/notices",
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
      res.redirect("/stcolumbus/notice/manage");
    }
  } else {
    const notice = await Notice.create({
      title: req.body.title,
      mess: req.body.mess,
    });
    res.send(notice);
  }
}

async function handelNoticeUpdateDet(req, res) {
  console.log(req.body);
  let data = await Notice.findById(req.params.id);
  data = await Notice.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title || data.title,
      mess: req.body.mess || data.mess,
    },
    { new: true }
  );
  res.redirect("/stcolumbus/jaj/ekdara/admin#notice");
}

async function handelNoticeUpdateImg(req, res) {
  if (req.body.uploaded == true) {
    const notice = await Notice.findByIdAndUpdate(req.params.id, {
      img: req.body.filename,
    }).then((noticeIs) => {
      console.log(noticeIs.img);
      if (noticeIs.img && noticeIs.img !== "/adminAvt/defaultAvt.png") {
        try {
          const imagePath = path.join(__dirname, "../assets", noticeIs.img); // Adjust based on your storage setup
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
    res.redirect("/stcolumbus/jaj/ekdara/admin#notice");
  } else {
    try {
      const imagePath = path.join(
        __dirname,
        "../assets/notices",
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
      res.redirect(`/home/noticeUpdate/${req.params.id}`);
    } catch (err) {
      res.redirect(`/home/noticeUpdate/${req.params.id}`);
    }

  }
}

module.exports = {
  handelNoticeForm,
  handelNoticeUpdateDet,
  handelNoticeUpdateImg,
};
