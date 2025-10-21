const link = document.querySelector(".links");
const menuIcon = document.getElementById("menu-icon");
const admission = document.querySelector(".admission");

menuIcon.addEventListener("click", () => {
    const isOpen = link.classList.contains("active");

    if (!isOpen) {
        // Open menu
        link.style.display = "flex";
        admission.style.display = "flex";
        requestAnimationFrame(() => {
            link.classList.add("active");
            admission.classList.add("active");
        });
        menuIcon.src = "/images/icons/close.svg"; // close icon
    } else {
        // Close menu
        link.classList.remove("active");
        admission.classList.remove("active");
        menuIcon.src = "/images/icons/menu.svg"; // menu icon
    }
});
