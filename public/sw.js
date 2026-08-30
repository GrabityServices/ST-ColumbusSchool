/* =========================================================
   SERVICE WORKER
   Handles real push notifications
========================================================= */


/* =========================================================
   PUSH EVENT
========================================================= */

self.addEventListener("push", event => {

  let data = {};

  try {

    if (event.data) {
      data = event.data.json();
    }

  } catch (error) {

    console.error(
      "Push data error:",
      error
    );

  }


  const title =
    data.title ||
    "New Notice";


  const message =
    data.body ||
    "A new notice has been published.";


  const url =
    data.url ||
    "/";


  const notificationOptions = {

    body: message,

    data: {
      url: url
    }

  };


  event.waitUntil(

    self.registration.showNotification(
      title,
      notificationOptions
    )

  );

});


self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();


    const url =
      event.notification.data?.url ||
      "/";


    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      })

      .then(clientList => {

        for (
          const client of clientList
        ) {

          if (
            client.url.startsWith(
              self.location.origin
            )
          ) {

            client.navigate(url);

            return client.focus();

          }

        }


        if (clients.openWindow) {

          return clients.openWindow(
            url
          );

        }

      })

    );

  }
);

/* =========================================================
   NOTIFICATION CLICK
========================================================= */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();


    const url =
      event.notification.data?.url ||
      "/";


    event.waitUntil(

      clients.matchAll({

        type: "window",

        includeUncontrolled: true

      })

      .then(clientList => {

        /* -----------------------------------------------
           If website is already open
        ------------------------------------------------ */

        for (
          const client of clientList
        ) {

          if (
            client.url.startsWith(
              self.location.origin
            ) &&
            "focus" in client
          ) {

            client.navigate(url);

            return client.focus();

          }

        }


        /* -----------------------------------------------
           Otherwise open website
        ------------------------------------------------ */

        if (
          clients.openWindow
        ) {

          return clients.openWindow(
            url
          );

        }

      })

    );

  }
);