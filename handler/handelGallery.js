const Gallery = require("../models/gallery.js");

async function handelGallery(req, res) {
  const images = await Gallery.find({});
  const jsonData = images.map((image) => image.toJSON());
  res.json(jsonData);
}

async function setGalleryForm(req, res) {
  if (req.body.uploaded == true) {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, {
      img: req.body.filename,
    });
    res.redirect("/home/gallery");
  } else {
    res.redirect(`/home/galleryUpdate/${req.params.id}`);
  }
}

async function setGalleryFormDet(req, res) {
  const galleryIs = await Gallery.findById(req.params.id);
  // console.log(achivIS)
  const title = req.body.title || galleryIs.title;
  const desc = req.body.desc || galleryIs.desc;
  const EventDate = req.body.EventDate || galleryIs.EventDate;

  const newData = {
    title,
    desc,
    EventDate,
  };
  // console.log(newData)

  const data = await Gallery.findByIdAndUpdate(
    req.params.id,
    { ...newData },
    { new: true }
  );
  // console.log(data)
  res.redirect("/home/gallery");
}

function handelNewGallery(req, res) {
  res.render("newGallery.ejs");
}

async function handelNewGalleryForm(req, res) {
  if (req.body.uploaded) {
    const {title,desc,EventDate,filename}=req.body
    const newGal = await Gallery.create({
      title,
      desc,
      EventDate,
      img: filename,
    });
    // console.log(newGal);
    return res.redirect('/home/gallery')
  }
  res.redirect('/home/gallery/new')
}
module.exports = {
  handelGallery,
  setGalleryForm,
  setGalleryFormDet,
  handelNewGallery,
  handelNewGalleryForm,
};
