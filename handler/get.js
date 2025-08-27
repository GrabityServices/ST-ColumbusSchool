const Admins = require("../models/admins.js");
const Achiv = require("../models/achivments.js");
const Gallery = require("../models/gallery.js");
async function handelGetAdmin(req, res) {
  const admins = await Admins.find({});
  const jsonData = admins.map((admin) => admin.toJSON());
  res.render("404.ejs", { path: req.path, admins: jsonData });
}

async function handelGetAchiv(req, res) {
  const achivs = await Achiv.find({});
  const jsonData = achivs.map((achiv) => achiv.toJSON());
  // console.log(jsonData)
  res.render("achiv.ejs", { path: req.path, achivs: jsonData });
}

async function handelGetGallery(req, res) {
    const data = await Gallery.find({});
    res.render("gallery.ejs", { images: data });
}

module.exports = {
  handelGetAdmin,
  handelGetAchiv,
  handelGetGallery
};
