const PushSubscription = require("../models/pushSubscription");


/* =========================================================
   GET VAPID PUBLIC KEY
========================================================= */

async function getPublicKey(req, res) {

  res.json({
    publicKey: process.env.VAPID_PUBLIC_KEY,
  });

}


/* =========================================================
   SAVE PUSH SUBSCRIPTION
========================================================= */

async function subscribePush(req, res) {

  try {

    const subscription = req.body;


    if (
      !subscription ||
      !subscription.endpoint ||
      !subscription.keys ||
      !subscription.keys.p256dh ||
      !subscription.keys.auth
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid push subscription.",

      });

    }


    /* =====================================================
       SAVE / UPDATE SUBSCRIPTION
    ====================================================== */

    await PushSubscription.findOneAndUpdate(

      {
        endpoint:
          subscription.endpoint,
      },

      {

        endpoint:
          subscription.endpoint,

        keys: {

          p256dh:
            subscription.keys.p256dh,

          auth:
            subscription.keys.auth,

        },

      },

      {

        upsert: true,

        new: true,

        setDefaultsOnInsert: true,

      }

    );


    console.log(
      "Push subscription saved."
    );


    res.json({

      success: true,

      message:
        "Push notifications enabled.",

    });


  } catch (error) {

    console.error(
      "Subscribe push error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to save push subscription.",

    });

  }

}


module.exports = {

  getPublicKey,

  subscribePush,

};