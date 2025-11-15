const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs"); 
const sharp = require("sharp"); 
 
// Store file in memory before saving 
const storage = multer.memoryStorage(); 
 
const adminAccountAvt = multer({ 
  storage, 
  limits: { fileSize: 7 * 1024 * 1024 }, // Max 7MB allowed 
  fileFilter(req, file, cb) { 
    const allowed = /\.(jpg|jpeg|png)$/i; 
    if (!allowed.test(file.originalname)) { 
      return cb(new Error("Only JPG, JPEG, PNG allowed!")); 
    } 
    cb(null, true); 
  }, 
}); 
 
// ============ Save & Compress Logic ============ 
async function saveAdminAccountAvt(req, res, next) { 
  try { 
    if (!req.file) return next(); 
 
    const uploadDir = path.resolve("./assets/adminAccountAvt/"); 
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true }); 
 
    const unique = Date.now() + "-" + req.file.originalname; 
    const outputPath = path.join(uploadDir, unique); 
 
    const fileSize = req.file.size; 
    let quality = null; 
 
    if (fileSize > 3 * 1024 * 1024) { 
      quality = 25; // reduce 75% 
    } else if (fileSize > 1 * 1024 * 1024) { 
      quality = 50; // reduce 50% 
    } 
 
    if (quality) { 
      await sharp(req.file.buffer) 
        .jpeg({ quality }) 
        .toFile(outputPath); 
    } else { 
      fs.writeFileSync(outputPath, req.file.buffer); // direct save 
    } 
 
    req.body.uploaded = true; 
    req.body.filename = `/adminAccountAvt/${unique}`; 
    next(); 
 
  } catch (err) { 
    console.log("Admin Account Avatar Upload Error:", err); 
    req.body.uploaded = false; 
    next(); 
  } 
} 
 
module.exports = { adminAccountAvt, saveAdminAccountAvt };