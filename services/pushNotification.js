const webpush = require("web-push");

const PushSubscription = require(
  "../models/pushSubscription"
);


/* =========================================================
   VAPID CONFIGURATION
========================================================= */

webpush.setVapidDetails(

  process.env.VAPID_EMAIL,

  process.env.VAPID_PUBLIC_KEY,

  process.env.VAPID_PRIVATE_KEY

);


/* =========================================================
   SEND PUSH TO ALL SUBSCRIBERS
========================================================= */

async function sendPushNotification(
  title,
  message,
  url = "/"
) {

  const subscriptions =
    await PushSubscription.find();


  console.log(
    `Sending push to ${subscriptions.length} subscribers`
  );


  const payload =
    JSON.stringify({

      title: title,

      body: message,

      url: url,

    });


  const results =
    await Promise.allSettled(

      subscriptions.map(
        async (subscription) => {

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


            return {
              success: true,
              id: subscription._id,
            };

          } catch (error) {

            console.error(
              "Push send error:",
              error.statusCode,
              error.message
            );


            /* ==========================================
               SUBSCRIPTION NO LONGER VALID
            ========================================== */

            if (
              error.statusCode === 404 ||
              error.statusCode === 410
            ) {

              await PushSubscription.deleteOne({
                _id: subscription._id,
              });

              console.log(
                "Removed expired subscription:",
                subscription._id
              );

            }


            throw error;

          }

        }
      )

    );


  return results;

}


module.exports = {
  sendPushNotification,
};