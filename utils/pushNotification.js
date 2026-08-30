const webpush = require("web-push");

const PushSubscription = require("../models/pushSubscription");


/* =========================================================
   VAPID CONFIGURATION
========================================================= */

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


/* =========================================================
   SEND PUSH NOTIFICATION
========================================================= */

async function sendPushNotification(title, message, url = "/") {

  try {

    const subscriptions =
      await PushSubscription.find({});


    if (subscriptions.length === 0) {

      console.log(
        "No push notification subscriptions found."
      );

      return;

    }


    /* =====================================================
       NOTIFICATION DATA
    ====================================================== */

    const payload = JSON.stringify({

      title: title,

      body: message,

      url: url,

    });


    /* =====================================================
       SEND TO ALL SUBSCRIBED DEVICES
    ====================================================== */

    for (const subscription of subscriptions) {

      try {

        await webpush.sendNotification(
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

          payload
        );


        console.log(
          "Push notification sent."
        );


      } catch (error) {

        console.error(
          "Push notification error:",
          error.statusCode,
          error.message
        );


        /* ================================================
           REMOVE EXPIRED SUBSCRIPTION
        ================================================= */

        if (
          error.statusCode === 404 ||
          error.statusCode === 410
        ) {

          await PushSubscription.deleteOne({
            _id: subscription._id,
          });


          console.log(
            "Removed expired push subscription."
          );

        }

      }

    }

  } catch (error) {

    console.error(
      "Push notification system error:",
      error
    );

  }

}


module.exports = {
  sendPushNotification,
};