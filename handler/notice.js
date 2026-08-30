const Notice = require("../models/notice.js");
const fs = require("fs");
const path = require("path");
const {
  sendPushNotification
} = require("../services/pushNotification.js");

async function handelNoticeForm(req, res) {

  try {

    let notice;


    /* =====================================================
       NOTICE WITH FILE
    ===================================================== */

    if (req.file) {

      if (req.body.uploaded) {

        notice =
          await Notice.create({

            title:
              req.body.title,

            mess:
              req.body.mess,

            img:
              req.body.filename,

          });


      } else {

        /* ================================================
           DELETE UPLOADED FILE
        ================================================ */

        const imagePath =
          path.join(
            __dirname,
            "../assets/notices",
            req.body.filename
          );


        fs.unlink(
          imagePath,
          (err) => {

            if (err) {

              console.error(
                "Error deleting image:",
                err
              );

            } else {

              console.log(
                "Image deleted successfully"
              );

            }

          }
        );


        return res.redirect(
          "/stcolumbus/notice/manage"
        );

      }

    }

    /* =====================================================
       NOTICE WITHOUT FILE
    ===================================================== */

    else {

      notice =
        await Notice.create({

          title:
            req.body.title,

          mess:
            req.body.mess,

        });

    }


    /* =====================================================
       SEND PUSH NOTIFICATION
    ===================================================== */

    try {

      const notificationMessage =
        req.body.mess?.trim()
          ? req.body.mess.trim().slice(0, 120)
          : "A new notice has been published.";


      await sendPushNotification(

        notice.title,

        notificationMessage,

        "/notice"

      );


      console.log(
        "New notice push notification sent."
      );


    } catch (pushError) {

      /*
        Do NOT fail notice creation if
        push notification fails.
      */

      console.error(
        "Push notification failed:",
        pushError
      );

    }


    /* =====================================================
       REDIRECT
    ===================================================== */

    return res.redirect(
      "/stcolumbus/jaj/ekdara/admin#notice"
    );


  } catch (error) {

    console.error(
      "Create notice error:",
      error
    );


    return res.status(500).send(
      "Unable to create notice."
    );

  }

}
async function handelNoticeUpdateDet(req, res) {
  console.log(req.body);
  let data = await Notice.findById(req.params.id);
  data = await Notice.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title || data.title,
      mess: req.body.mess || data.mess,
    },
    { new: true }
  );
  res.redirect("/stcolumbus/jaj/ekdara/admin#notice");
}

async function handelNoticeUpdateImg(req, res) {
  if (req.body.uploaded == true) {
    const notice = await Notice.findByIdAndUpdate(req.params.id, {
      img: req.body.filename,
    }).then((noticeIs) => {
      console.log(noticeIs.img);
      if (noticeIs.img && noticeIs.img !== "/adminAvt/defaultAvt.png") {
        try {
          const imagePath = path.join(__dirname, "../assets", noticeIs.img); // Adjust based on your storage setup
          // Delete the image file
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            } else {
              console.log("Image deleted successfully");
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
    res.redirect("/stcolumbus/jaj/ekdara/admin#notice");
  } else {
    try {
      const imagePath = path.join(
        __dirname,
        "../assets/notices",
        req.body.filename
      ); // Adjust based on your storage setup

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
      res.redirect(`/home/noticeUpdate/${req.params.id}`);
    } catch (err) {
      res.redirect(`/home/noticeUpdate/${req.params.id}`);
    }

  }
}

module.exports = {
  handelNoticeForm,
  handelNoticeUpdateDet,
  handelNoticeUpdateImg,
};
