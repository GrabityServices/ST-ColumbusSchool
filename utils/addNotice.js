const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const storage = multer.memoryStorage(); // store file in memory first 

const noticeAvt = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit 
  fileFilter(req, file, cb) {
    const allowed = /\.(jpg|jpeg|png|pdf)$/i;
    if (!allowed.test(file.originalname)) {
      return cb(new Error("Only JPG, PNG, JPEG, and PDF allowed!!"));
    }
    cb(null, true);
  },
});

// ====== File Save & Compression Logic ====== 
async function saveNoticeFile(req, res, next) {
  try {
    if (!req.file) return next();

    const uploadPath = path.resolve("./assets/notices/");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    const unique = Date.now() + "-" + req.file.originalname;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const isLarge = req.file.size > 500 * 1024; // > 500KB ? 

    const outputPath = path.join(uploadPath, unique);

    //  For Images (jpg/jpeg/png) 
    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      if (isLarge) {
        // Compress Only if size > 500KB 
        console.log("Compressing Image:", req.file.originalname);
        await sharp(req.file.buffer)
          .jpeg({ quality: 30 }) // compress ~70% 
          .toFile(outputPath);
      } else {
        // direct save (no compression) 
        fs.writeFileSync(outputPath, req.file.buffer);
      }

      req.body.uploaded = true;
      req.body.filename = `/notices/${unique}`;
    }

    //  For PDF 
    else if (ext === ".pdf") {
      if (isLarge) {
        // Save PDF normally or (optional compression) 
        fs.writeFileSync(outputPath, req.file.buffer);

        // OPTIONAL PDF COMPRESSION SUPPORT: 
        // const compress_pdf = require("compress-pdf"); 
        // await compress_pdf(outputPath, outputPath);  
      } else {
        // direct save 
        fs.writeFileSync(outputPath, req.file.buffer);
      }

      req.body.uploaded = true;
      req.body.filename = `/notices/${unique}`;
    }

    next();
  } catch (err) {
    console.log("File Upload Error:", err);
    req.body.uploaded = false;
    return next();
  }
}

module.exports = { noticeAvt, saveNoticeFile };