const multer=require('multer')
const path=require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./assets/achivAvt/'))
  },
  filename: function (req, file, cb) {
    const regex = /.\.(jpg|png|jpeg)$/i;
    if (regex.test(file.originalname)) {
      const uniqueSuff = Date.now() ;
      cb(null, uniqueSuff + "-" + file.originalname);
      req.body.uploaded=true
      req.body.filename= "/achivAvt/"+uniqueSuff + "-" + file.originalname
    } else {
      cb(null,'unvalid'+Date.now()+file.originalname)
        req.body.uploaded=false
    }
  }
})

const achivAvt = multer({ storage: storage })

module.exports=achivAvt