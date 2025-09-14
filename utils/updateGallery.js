const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  limts: 10 * 1024 * 1024,
  destination: function (req, file, cb) {
    cb(null, path.resolve("./assets/galleryAvt/"));
  },
  filename: function (req, file, cb) {
    const regex = /.\.(jpg|png|jpeg)$/i;
    if (regex.test(file.originalname)) {
      const uniqueSuff = Date.now();
      cb(null, uniqueSuff + "-" + file.originalname);
      req.body.uploaded = true;
      req.body.filename = "/galleryAvt/" + uniqueSuff + "-" + file.originalname;
    } else {
      const dateis = Date.now() + file.originalname;
      cb(null, "unvalid" + dateis);
      req.body.uploaded = false;
      req.body.filename = "unvalid" + dateis;
    }
  },
});

const galleyAvt = multer({ storage: storage });

module.exports = galleyAvt;
