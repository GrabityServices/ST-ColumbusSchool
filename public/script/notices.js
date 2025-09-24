// LOAD MORE BUTTON
// script/notices.js

document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  const notices = document.querySelectorAll(".notice-card");
  let visibleCount = 3; // show first 3 initially

  // hide extra notices initially
  notices.forEach((n, i) => {
    if (i >= visibleCount) n.style.display = "none";
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += 3; // reveal 3 more each time
      notices.forEach((n, i) => {
        if (i < visibleCount) n.style.display = "block";
      });

      // hide button if no more notices
      if (visibleCount >= notices.length) {
        loadMoreBtn.style.display = "none";
      }
    });
  }
});



// GO TO TOP
const upArrow = document.getElementById( 'upArrow' );

upArrow.addEventListener( 'click', () => {
    window.scrollTo( {
        top: 0,
        behavior: 'smooth'
    } );
} );


// TO DOWNLOAD THE NOTICE
function openAndDownload(event, url) {
    event.preventDefault(); // stop normal link behavior

    // 1. Open in a new tab
    window.open(url, "_blank");

    // 2. Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop(); 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}