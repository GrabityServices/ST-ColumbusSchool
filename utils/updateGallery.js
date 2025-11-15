const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs"); 
const sharp = require("sharp"); 
 
// Store file in memory first 
const storage = multer.memoryStorage(); 
 
const galleryAvt = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit 
  fileFilter(req, file, cb) { 
    const allowed = /\.(jpg|jpeg|png)$/i; 
    if (!allowed.test(file.originalname)) { 
      return cb(new Error("Only JPG, JPEG, and PNG allowed!!")); 
    } 
    cb(null, true); 
  }, 
}); 
 
// ====== File Save & Compression Logic ====== 
async function saveGalleryFile(req, res, next) { 
  try { 
    if (!req.file) return next(); 
 
    const uploadPath = path.resolve("./assets/galleryAvt/"); 
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true }); 
 
    const unique = Date.now() + "-" + req.file.originalname; 
    const ext = path.extname(req.file.originalname).toLowerCase(); 
    const isLarge = req.file.size ; // > 500KB ? 
 
    const outputPath = path.join(uploadPath, unique); 
 
    // Image compression (only jpg/jpeg/png) 
    // Image compression (only jpg/jpeg/png) 
if ([".jpg", ".jpeg", ".png"].includes(ext)) { 
  const fileSize = req.file.size; // bytes 
 
  if (fileSize > 500 * 1024 && fileSize <= 1 * 1024 * 1024) { 
    // >500KB and <= 1MB → ~50% quality 
    await sharp(req.file.buffer) 
      .jpeg({ quality: 50 }) 
      .toFile(outputPath); 
 
  } else if (fileSize > 1 * 1024 * 1024 && fileSize <= 3 * 1024 * 1024) { 
    // >1MB and <= 3MB → ~25% quality 
    await sharp(req.file.buffer) 
      .jpeg({ quality: 35 }) 
      .toFile(outputPath); 
 
  } else if (fileSize > 3 * 1024 * 1024 && fileSize <= 5 * 1024 * 1024) { 
    // >3MB and <= 5MB → ~15% quality 
    await sharp(req.file.buffer) 
      .jpeg({ quality: 15 }) 
      .toFile(outputPath); 
 
  } else if (fileSize > 5 * 1024 * 1024 && fileSize <= 9 * 1024 * 1024) { 
    // >5MB and <= 7MB → ~10% quality 
    await sharp(req.file.buffer) 
      .jpeg({ quality: 10 }) 
      .toFile(outputPath); 
  }else if (fileSize > 9 * 1024 * 1024) { 
    // >7MB → ~7% quality 
    await sharp(req.file.buffer) 
      .jpeg({ quality: 1 }) 
      .toFile(outputPath); 
 
  } else { 
    // <=500KB → No compression, save original 
    fs.writeFileSync(outputPath, req.file.buffer); 
  } 
 
  req.body.uploaded = true; 
  req.body.filename = `/galleryAvt/${unique}`; 
} 
 
    next(); 
  } catch (err) { 
    console.log("Gallery Upload Error:", err); 
    req.body.uploaded = false; 
    return next(); 
  } 
} 
 
module.exports = { galleryAvt, saveGalleryFile };