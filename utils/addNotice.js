const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  limts: 5 * 1024 * 1024,
  destination: function (req, file, cb) {
    cb(null, path.resolve("./assets/notices/"));
  },
  filename: function (req, file, cb) {
    const regex = /.\.(jpg|png|jpeg|pdf)$/i;
    if (regex.test(file.originalname)) {
      const uniqueSuff = Date.now();
      cb(null, uniqueSuff + "-" + file.originalname);
      req.body.uploaded = true;
      req.body.filename = "/notices/" + uniqueSuff + "-" + file.originalname;
    } else {
      const dateis = Date.now() + file.originalname;
      cb(null, "unvalid" + dateis);
      req.body.uploaded = false;
      req.body.filename = "unvalid" + dateis;
    }
  },
});

const noticeAvt = multer({ storage: storage });

module.exports = noticeAvt;
