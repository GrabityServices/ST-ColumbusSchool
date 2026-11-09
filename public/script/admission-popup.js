
/* =========================================
   ADMISSION POPUP CONTROLLER
   No cookies / No storage
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const popup = document.getElementById("admissionPopup");
  const closeButton = document.getElementById("admissionPopupClose");

  if (!popup || !closeButton) return;

  let previousFocus = null;
  let showTimer = null;
  let autoCloseTimer = null;
  let reopenTimer = null;
  let isClosing = false;

  function openPopup() {

    if (!popup.hidden || isClosing) return;

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

    setTimeout(() => {

      popup.hidden = true;
      isClosing = false;

      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }

      // Show again after 5 minutes
      reopenTimer = setTimeout(openPopup, 5 * 60 * 1000);

    }, 350);
  }

  // Manual close
  closeButton.addEventListener("click", closePopup);

  // Close on outside click
  popup.addEventListener("click", event => {
    if (event.target === popup) {
      closePopup();
    }
  });

  // Close using Escape
  document.addEventListener("keydown", event => {

    if (event.key === "Escape" && !popup.hidden) {
      closePopup();
    }

  });

  // First appearance after 1.2 seconds
  showTimer = setTimeout(openPopup, 1200);

});
