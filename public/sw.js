
"use strict";

/* =========================================================
   ST. COLUMBUS PUBLIC SCHOOL
   SERVICE WORKER
   Web Push Notifications + Website Updates
========================================================= */


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", event => {

    console.log("Service Worker: Installing");

    // Do not activate automatically.
    // Wait for the user to click "Update Now".

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {

    console.log("Service Worker: Activated");

    event.waitUntil(

        self.clients.claim()

    );

});


/* =========================================================
   WEBSITE UPDATE MESSAGE
========================================================= */

self.addEventListener("message", event => {

    if (!event.data) return;

    if (event.data.type === "SKIP_WAITING") {

        console.log(
            "Service Worker: User accepted update"
        );

        self.skipWaiting();

    }

});


/* =========================================================
   PUSH NOTIFICATIONS
========================================================= */

self.addEventListener("push", event => {

    let data = {};

    try {

        if (event.data) {

            data = event.data.json();

        }

    } catch (error) {

        console.error(
            "Push JSON parse error:",
            error
        );

        try {

            data = {
                body: event.data
                    ? event.data.text()
                    : ""
            };

        } catch (textError) {

            console.error(
                "Push text parse error:",
                textError
            );

            data = {};

        }

    }


    const title =
        data.title ||
        "St. Columbus Public School";


    const body =
        data.body ||
        "A new notice has been published.";


    const url =
        data.url ||
        "/";


    const options = {

        body: body,

        icon:
            data.icon ||
            "/android-chrome-192x192.png",

        badge:
            data.badge ||
            "/android-chrome-192x192.png",

        tag:
            data.tag ||
            "school-notice",

        renotify: true,

        requireInteraction: false,

        vibrate: [
            200,
            100,
            200,
            100,
            400
        ],

        data: {
            url: url
        }

    };


    event.waitUntil(

        self.registration.showNotification(
            title,
            options
        )

    );

});


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

                for (
                    const client of clientList
                ) {

                    if (

                        client.url.startsWith(
                            self.location.origin
                        )

                    ) {

                        if (
                            "focus" in client
                        ) {

                            return client
                                .navigate(url)
                                .then(() =>
                                    client.focus()
                                );

                        }

                    }

                }


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


/* =========================================================
   SERVICE WORKER ERROR LOGGING
========================================================= */

self.addEventListener("error", event => {

    console.error(
        "Service Worker Error:",
        event.message
    );

});

self.addEventListener("unhandledrejection", event => {

    console.error(
        "Service Worker Promise Error:",
        event.reason
    );

});
