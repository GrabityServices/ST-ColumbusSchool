const multer=require('multer')
const path=require('path')

const storage = multer.diskStorage({
  limits:10*10*1024,
  destination: function (req, file, cb) {
    cb(null, path.resolve('./assets/adminAccountAvt/'))
  },
  filename: function (req, file, cb) {
    const regex = /.\.(jpg|png|jpeg)$/i;
    if (regex.test(file.originalname)) {
      const uniqueSuff = Date.now() ;
      cb(null, uniqueSuff + "-" + file.originalname);
      req.body.uploaded=true
      req.body.filename =
        "/adminAccountAvt/" + uniqueSuff + "-" + file.originalname;
    } else {
      cb(null,'unvalid'+Date.now()+file.originalname)
        req.body.uploaded=false
    }
  }
})

const adminAccountAvt = multer({ storage: storage });

module.exports = adminAccountAvt;