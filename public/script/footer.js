// Automatically update the copyright year every time the page loads
document.addEventListener("DOMContentLoaded", function () {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});