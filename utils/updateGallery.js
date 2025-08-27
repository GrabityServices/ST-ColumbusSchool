const multer=require('multer')
const path=require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./assets/galleryAvt/'))
  },
  filename: function (req, file, cb) {
    const regex = /.\.(jpg|png|jpeg)$/i;
    if (regex.test(file.originalname)) {
      const uniqueSuff = Date.now() ;
      cb(null, uniqueSuff + "-" + file.originalname);
      req.body.uploaded=true
      req.body.filename= "/galleryAvt/"+uniqueSuff + "-" + file.originalname
    } else {
      cb(null,'unvalid'+Date.now()+file.originalname)
        req.body.uploaded=false
    }
  }
})

const galleyAvt = multer({ storage: storage })

module.exports=galleyAvt