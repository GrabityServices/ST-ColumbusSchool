const Admins = require("../models/admins.js");

module.exports = async function handelGet(req, res) {
  const admins = await Admins.find({});
  const jsonData = admins.map((admin) => admin.toJSON());
  res.render("404.ejs", { path: req.path,admins:jsonData });
};
