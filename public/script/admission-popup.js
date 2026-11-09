
/* =========================================
   ADMISSION POPUP CONTROLLER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const popup = document.getElementById("admissionPopup");
  const closeButton = document.getElementById("admissionPopupClose");

  if (!popup || !closeButton) return;

  const storageKey = "stColumbusAdmissionPopupDismissed";

  let previousFocus = null;
  let showTimer = null;
  let autoCloseTimer = null;
  let isClosing = false;

  function openPopup() {

    if (!popup.hidden) return;

    previousFocus = document.activeElement;

    popup.hidden = false;
    popup.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      popup.classList.add("is-visible");
      closeButton.focus();
    });

    // Automatically close after 15 seconds
    autoCloseTimer = setTimeout(() => {
      closePopup();
    }, 15000);
  }

  function closePopup() {

    if (popup.hidden || isClosing) return;

    isClosing = true;

    clearTimeout(autoCloseTimer);

    popup.classList.remove("is-visible");
    popup.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    try {
    cookieStore.set(storageKey, "true", { expires: new Date(Date.now() + 5 * 60 * 1000) }); // Expires in 5minutes
    } catch (error) {
      console.warn("Popup session storage unavailable.");
    }

    setTimeout(() => {

      popup.hidden = true;
      isClosing = false;

      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }

    }, 350);
  }

  // Manual close
  closeButton.addEventListener("click", closePopup);

  // Close on outside click
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });

  // Close using Escape
  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && !popup.hidden) {
      closePopup();
    }

  });

  // Show once per browser session
  let alreadyDismissed = false;

  try {
    alreadyDismissed =
      cookieStore.get(storageKey).then((value) => value === "true");
  } catch (error) {
    console.warn("Popup session storage unavailable.");
  }

  if (!alreadyDismissed) {
    showTimer = setTimeout(openPopup, 1200);
  }

});
