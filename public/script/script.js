const link = document.querySelector(".links");
const menuIcon = document.getElementById("menu-icon");
const admission = document.querySelector(".admission");

// Handle active link state on clicks (includes .admission)
const navLinks = document.querySelectorAll('.links a, .admission');
navLinks.forEach(l => {
    l.addEventListener('click', (e) => {
        // Remove active class from all links
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        // Add active class to clicked link
        l.classList.add('active');
    });
});

// Set initial active link based on current URL (includes .admission)
function setActiveLink() {
    const currentPath = window.location.pathname;
    navLinks.forEach(l => {
        const href = l.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            l.classList.add('active');
        } else {
            l.classList.remove('active');
        }
    });
}

// Menu toggle logic
menuIcon.addEventListener("click", () => {
    const isOpen = link.classList.contains("active");

    if (!isOpen) {
        // Open menu
        menuIcon.src = "/images/icons/close.svg"; // close icon
        link.style.display = "flex";
        admission.style.display = "flex";
        requestAnimationFrame(() => {
            link.classList.add("active");
            admission.classList.add("active");
        });
    } else {
        // Close menu
        menuIcon.src = "/images/icons/menu.svg"; // menu icon
        // Ensure visibility during slide-out transition
        link.style.visibility = "visible";
        admission.style.visibility = "visible";
        // Start the slide-out transition
        requestAnimationFrame(() => {
            link.classList.remove("active");
            admission.classList.remove("active");
        });
        // Hide after transition completes
        setTimeout(() => {
            link.style.display = "none";
            admission.style.display = "none";
        }, 500);
    }
});

// Handle window resize to reset menu state on breakpoint change
window.addEventListener('resize', () => {
    if (window.innerWidth > 915) {
        // Reset to desktop layout
        link.classList.remove('active');
        admission.classList.remove('active');
        link.style.display = '';
        admission.style.display = '';
        link.style.visibility = '';
        admission.style.visibility = '';
        menuIcon.src = "/images/icons/menu.svg";
    }
});

// Initial check on load
if (window.innerWidth > 915) {
    link.style.display = '';
    admission.style.display = '';
    link.style.visibility = '';
    admission.style.visibility = '';
}

// Set initial active link on DOM load
document.addEventListener('DOMContentLoaded', setActiveLink);