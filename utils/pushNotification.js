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
    `📢 Sending push to ${subscriptions.length} subscriber(s)`
  );


  /* =======================================================
     NOTHING TO SEND
  ======================================================= */

  if (
    subscriptions.length === 0
  ) {

    console.log(
      "ℹ️ No push subscriptions found."
    );


    return {

      total: 0,

      sent: 0,

      failed: 0,

      removed: 0

    };

  }


  /* =======================================================
     PAYLOAD
  ======================================================= */

  const payload =
    JSON.stringify({

      title:
        title || "St. Columbus Public School",

      body:
        message || "You have a new notification.",

      url:
        url || "/",

      icon:
        "/android-chrome-192x192.png",

      badge:
        "/android-chrome-192x192.png",

      tag:
        "school-notice",

      data: {

        url:
          url || "/"

      }

    });


  /* =======================================================
     SEND TO ALL DEVICES
  ======================================================= */

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
                    subscription.keys.auth

                }

              },

              payload

            );


            console.log(
              "✅ Push sent:",
              subscription._id.toString()
            );


            return {

              success: true,

              id:
                subscription._id,

              endpoint:
                subscription.endpoint

            };

          } catch (error) {

            console.error(
              "❌ Push failed:",
              subscription._id.toString(),

              "| HTTP:",
              error.statusCode,

              "| Error:",
              error.message
            );


            /* =================================================
               DEFINITELY EXPIRED / INVALID SUBSCRIPTION
            ================================================= */

            if (

              error.statusCode === 404 ||
              error.statusCode === 410

            ) {

              try {

                await PushSubscription.deleteOne({

                  _id:
                    subscription._id

                });


                console.log(
                  "🗑️ Removed expired subscription:",
                  subscription._id.toString()
                );


                return {

                  success: false,

                  removed: true,

                  statusCode:
                    error.statusCode,

                  id:
                    subscription._id

                };

              } catch (deleteError) {

                console.error(
                  "❌ Failed to remove expired subscription:",
                  deleteError
                );

              }

            }


            /* =================================================
               TEMPORARY / OTHER ERROR
               
               DO NOT DELETE SUBSCRIPTION
            ================================================= */

            return {

              success: false,

              removed: false,

              statusCode:
                error.statusCode || null,

              error:
                error.message,

              id:
                subscription._id

            };

          }

        }
      )

    );


  /* =======================================================
     SUMMARY
  ======================================================= */

  let sent = 0;

  let failed = 0;

  let removed = 0;


  for (
    const result of results
  ) {

    if (
      result.status !== "fulfilled"
    ) {

      failed++;

      continue;

    }


    const value =
      result.value;


    if (
      value.success
    ) {

      sent++;

    } else {

      failed++;

    }


    if (
      value.removed
    ) {

      removed++;

    }

  }


  const summary = {

    total:
      subscriptions.length,

    sent:
      sent,

    failed:
      failed,

    removed:
      removed

  };


  console.log(
    "📊 Push notification summary:",
    summary
  );


  return summary;

}


module.exports = {

  sendPushNotification

};