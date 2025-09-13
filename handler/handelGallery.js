const path = require("path");
const fs = require("fs");
const Gallery = require("../../ddd/models/gallery.js");
const { title } = require("process");

async function setGalleryForm(req, res) {
  if (req.body.uploaded == true) {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, {
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
    res.redirect("/stcolumbus/jaj/ekdara/admin#gallery");
  } else {
    try {
      const imagePath = path.join(
        __dirname,
        "../assets/galleryAvt",
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
      res.redirect(`/home/galleryUpdate/${req.params.id}`);
    } catch (err) {
      res.redirect(`/home/galleryUpdate/${req.params.id}`);
    }
  }
}

async function setGalleryFormDet(req, res) {
  const galleryIs = await Gallery.findById(req.params.id);
  // console.log(achivIS)
  const title = req.body.title || galleryIs.title;
  const desc = req.body.desc || galleryIs.desc;
  // const EventDate = req.body.EventDate || galleryIs.EventDate;

  const newData = {
    title,
    desc,
    // EventDate,
  };
  // console.log(newData)

  const data = await Gallery.findByIdAndUpdate(
    req.params.id,
    { ...newData },
    { new: true }
  );
  // console.log(data)
  res.redirect("/stcolumbus/jaj/ekdara/admin#gallery");
}
// ==============================================================================================
async function handelNewGallery(req, res) {
  // const disc = await Gallery.distinct("EventDate");
  // console.log(disc);
  if (req.query && req.query.title && req.query.date) {
    res.render("newGallery.ejs", {
      date: req.query.date,
      title: req.query.title,
    });
  } else if (req.query && req.query.title) {
    res.render("newGallery.ejs", { date: undefined, title: req.query.title });
  } else {
    res.render("newGallery.ejs", { date: undefined, title: undefined });
  }
}

async function handelNewGalleryForm(req, res) {
  if (req.body.uploaded) {
    const { title, desc, EventDate, filename } = req.body;
    const newGal = await Gallery.create({
      title,
      desc,
      EventDate,
      img: filename,
    });
    // console.log(newGal);
    return res.redirect("/stcolumbus/jaj/ekdara/admin#admin");
  } else {
    try {
      const imagePath = path.join(
        __dirname,
        "../assets/galleryAvt",
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
      res.redirect(`/home/gallery/new`);
    } catch (err) {
      res.redirect(`/home/gallery/new`);
    }
  }
}
module.exports = {
  setGalleryForm,
  setGalleryFormDet,
  handelNewGallery,
  handelNewGalleryForm,
};
