// document.addEventListener("DOMContentLoaded", () => {
//   const developerCredit = document.getElementById("developerCredit");
//   const closeButton = document.getElementById("developerCreditClose");

//   if (!developerCredit) {
//     console.error("Developer credit popup not found.");
//     return;
//   }

//   // Show after 3 seconds
//   setTimeout(() => {
//     developerCredit.classList.add("active");

//     // Hide automatically after 3 seconds
//     setTimeout(() => {
//       developerCredit.classList.remove("active");
//     }, 3000);

//   }, 3000);


//   // Close button
//   if (closeButton) {
//     closeButton.addEventListener("click", (event) => {
//       event.preventDefault();
//       event.stopPropagation();

//       developerCredit.classList.remove("active");
//     });
//   }


//   // Click developer credit → Google search
//   developerCredit.addEventListener("click", (event) => {

//     // Don't search when clicking the close button
//     if (event.target.closest("#developerCreditClose")) {
//       return;
//     }

//     window.open(
//       "https://www.google.com/search?q=dkumarjaj",
//       "_blank",
//       "noopener,noreferrer"
//     );

//   });

// });
// Automatically update the copyright year every time the page loads
document.addEventListener("DOMContentLoaded" , function () {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});