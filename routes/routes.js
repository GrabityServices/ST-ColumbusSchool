const express = require("express");
const stcolumbus = express.Router();
const adminAvt = require("../utils/updateAdmin.js");
const noticeAvt = require("../utils/addNotice.js");
const galleyAvt = require("../utils/updateGallery.js");
const path = require("path");
const fs = require("fs");
const videoGall=require("../models/videoEmbedded.js");
// const UserAdmin = require("../models/userAdmin.js");
const {
  checkAdminAsEditor,
  checkAdminAsSuperadmin,
} = require("../middleware/checkAdmin.js");

const { setAdminForm, setAdminFormDet } = require("../handler/handelAdmin.js");

const {
  setGalleryForm,
  setGalleryFormDet,
  handelNewGallery,
  handelNewGalleryForm,
} = require("../handler/handelGallery.js");
const {
  handelNoticeForm,
  handelNoticeUpdateDet,
  handelNoticeUpdateImg,
} = require("../handler/notice.js");

const { handelFeeSet } = require("../handler/handelFeeSet.js");
const Gallery = require("../models/gallery.js");
const Notice = require("../models/notice.js");
const Admission = require("../models/admission.js");
const Contact = require("../models/contact.js");
// ==================================================
// admin Work
stcolumbus
  .route("/adminUpdate/:id")
  .get(checkAdminAsEditor,(req, res) =>
    res.render("takeFile.ejs", {
      id: req.params.id,
      adminUpdate: true,
      userAdminUpdate: false,
      galleryUpdate: false,
      noticeUpdate: false,
    })
  )
  .post(checkAdminAsEditor,adminAvt.single("img"), setAdminForm);

stcolumbus
  .route("/adminUpdate/details/:id")
  .get(checkAdminAsEditor,(req, res) => res.render("updateAdminDet.ejs", { id: req.params.id }))
  .post(checkAdminAsEditor,setAdminFormDet);

// Gallery work

stcolumbus
  .route("/galleryUpdate/:id")
  .get(checkAdminAsEditor, (req, res) =>
    res.render("takeFile.ejs", {
      id: req.params.id,
      adminUpdate: false,
      userAdminUpdate: false,
      galleryUpdate: true,
      noticeUpdate: false,
    })
  )
  .post(checkAdminAsEditor, galleyAvt.single("img"), setGalleryForm);

stcolumbus
  .route("/galleryUpdate/details/:id")
  .get(checkAdminAsEditor, (req, res) =>
    res.render("galleryUpdateDet.ejs", { id: req.params.id })
  )
  .post(checkAdminAsEditor, setGalleryFormDet);

stcolumbus
  .route("/galleryDelete/:id")
  .get(checkAdminAsEditor, async (req, res) => {
    const data = await Gallery.findByIdAndDelete(req.params.id);

    if (data.img && data.img !== "/adminAvt/defaultAvt.png") {
      const imagePath = path.join(__dirname, "../assets", data.img); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }
    res.redirect("/stcolumbus/jaj/ekdara/admin#gallery");
  });

stcolumbus
  .route("/gallery/new")
  .get(checkAdminAsEditor, handelNewGallery)
  .post(checkAdminAsEditor, galleyAvt.single("img"), handelNewGalleryForm);

// ===================================================
//Notice Work
stcolumbus
  .route("/notice/new")
  .get(checkAdminAsEditor, (req, res) => res.render("createNotice.ejs"))
  .post(checkAdminAsEditor, noticeAvt.single("img"), handelNoticeForm);

stcolumbus
  .route("/noticeUpdate/details/:id")
  .get(checkAdminAsEditor, (req, res) => {
    res.render("noticeDetUpdate.ejs", { id: req.params.id });
  })
  .post(checkAdminAsEditor, handelNoticeUpdateDet);

stcolumbus
  .route("/noticeUpdate/:id")
  .get(checkAdminAsEditor, (req, res) =>
    res.render("takeFile.ejs", {
      id: req.params.id,
      adminUpdate: false,
      userAdminUpdate: false,
      galleryUpdate: false,
      noticeUpdate: true,
    })
  )
  .post(checkAdminAsEditor, noticeAvt.single("img"), handelNoticeUpdateImg);

stcolumbus
  .route("/noticeDelete/:id")
  .get(checkAdminAsEditor, async (req, res) => {
    const data = await Notice.findByIdAndDelete(req.params.id);

    if (data.img && data.img !== "/adminAvt/defaultAvt.png") {
      const imagePath = path.join(__dirname, "../assets", data.img); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }
    res.redirect("/stcolumbus/jaj/ekdara/admin#notice");
  });

//
stcolumbus
  .route("/feeUpdate")
  .get(checkAdminAsEditor, (req, res) => {
    res.render("setnewFee.ejs");
  })
  .post(checkAdminAsEditor, handelFeeSet);

stcolumbus.route("/admission/handeladmission/:role").get(async (req, res) => {
  if (req.params.role == "superadmin") {
    const forms = await Admission.find({ admissionStatus: "DVRL" });

    res.render("allAdmissionFor.ejs", { forms, supAd: true, done: false });
  } else if (req.params.role === "allDone") {
    const forms = await Admission.find({ admissionStatus: "DONE" });
    res.render("allAdmissionFor.ejs", { forms, supAd: false, done: true });
  } else {
    const forms = await Admission.find({ admissionStatus: "PACR" });
    res.render("allAdmissionFor.ejs", { forms, supAd: false, done: false });
  }
});

stcolumbus
  .route("/admission/updateStatus/PACR/:id")
  .get(checkAdminAsSuperadmin, async (req, res) => {
    try {
      await Admission.findByIdAndUpdate(req.params.id, {
        admissionStatus: "PACR",
      });
      res.redirect("/home/admission/handeladmission/superadmin");
    } catch (err) {
      res.send("Updation failed | Try letter");
    }
  });

stcolumbus
  .route("/admission/updateStatus/DVRL/:id")
  .get(checkAdminAsEditor, async (req, res) => {
    try {
      await Admission.findByIdAndUpdate(req.params.id, {
        admissionStatus: "DVRL",
      });
      res.redirect("/home/admission/handeladmission/editor");
    } catch (err) {
      res.send("Updation failed | Try letter");
    }
  });

stcolumbus
  .route("/admission/updateStatus/DONE/:id")
  .get(checkAdminAsSuperadmin, async (req, res) => {
    try {
      await Admission.findByIdAndUpdate(req.params.id, {
        admissionStatus: "DONE",
      });
      res.redirect("/home/admission/handeladmission/superadmin");
    } catch (err) {
      res.send("Updation failed | Try letter");
    }
  });

stcolumbus.route("/admission/updateStatus/CANCEL/:id").get(async (req, res) => {
  try {
    const data = await Admission.findByIdAndDelete(req.params.id);

    if (data.admissionStatus == "PACR") {
      return res.redirect("/home/admission/handeladmission/editor");
    }
    res.redirect("/home/admission/handeladmission/superadmin");
  } catch (err) {
    res.send("Updation failed | Try letter");
  }
});

//

stcolumbus.route("/contact/forms/:role").get(async (req, res) => {
  if (req.params.role == "superadmin") {
    const contacts = await Contact.find({ status: "CALLED" });
    res.render("allContact.ejs", { contacts, supAd: true });
  } else {
    const contacts = await Contact.find({ status: "ATCARE" });
    res.render("allContact.ejs", { contacts, supAd: false });
  }
});

stcolumbus.route("/contact/updateStatus/CALLED/:id").get(async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { status: "CALLED" });
  } catch (err) {
    console.log(err);
  }
  res.redirect("/home/contact/forms/editor");
});
stcolumbus.route("/contact/delete/:id").get(async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
  } catch (err) {
    console.log(err);
  }
  res.redirect("/home/contact/forms/superadmin");
});

stcolumbus.route("/video/embedded").get( async (req, res) => {
  res.render("setVideoEmbeded.ejs");
}).post( async (req, res) => {
  const videoEmbed = req.body.videoEmbed.trim();
  if(videoEmbed && videoEmbed!=""&& videoEmbed.length>10){
    try{
      await videoGall.create({videoEmbed:videoEmbed});
    res.status(200).json({ message: "Video embed code saved successfully!" });
    }catch(err){
      if(err.code===11000){
        return res.status(400).json({ message: "This video embed code already exists." });
      }else if(err.name==="ValidationError"){ 
        return res.status(400).json({ message: "Invalid video embed code format." });
        }


      else{
        console.error(err);
        return res.status(500).json({ message: "Failed to save video embed code. Please try again." });
      }       
  }
}else {
    return res.status(400).json({ message: "Video embed code is required." });
  } 
})

stcolumbus.route("/video/delete/:id").get( async (req, res) => {
  try {
    await videoGall.findByIdAndDelete(req.params.id);
    res.redirect("/stcolumbus/jaj/ekdara/admin#video");
  } catch (err) { console.log(err);
    res.status(500).json({ message: "Failed to delete video embed code. Please try again."});
  }   
})
stcolumbus.route("/video/update/:id").get( async (req, res) => {
  res.render("updateVideoEmbeded.ejs",{id:req.params.id});
})
.post(async (req, res) => {
  const newEmbed = req.body.videoEmbed.trim();
  if(newEmbed && newEmbed!=""&& newEmbed.length>10){
    try{ 

        await videoGall.findByIdAndUpdate(req.params.id,{videoEmbed:newEmbed},{new:true,runValidators:true});
        return res.status(200).json({ message: "Video embed code updated successfully!" });
  
     }catch(err){   
      if(err.code===11000){
        return res.status(400).json({ message: "This video embed code already exists." });
      } else if(err.name==="ValidationError"){
        return res.status(400).json({ message: "Invalid video embed code format." });
      } else{
      console.error(err);
      return res.status(500).json({ message: "Failed to update video embed code. Please try again." });
     }} 
    
}
 else {
      return res.status(400).json({ message: "Video embed code is required." });
    }})
module.exports = stcolumbus;
