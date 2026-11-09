
document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector("header nav");
    const links = document.getElementById("primary-navigation");
    const admission = nav?.querySelector(".admission");
    const menuToggle = document.getElementById("menu-toggle");

    if (!nav || !links || !admission || !menuToggle) return;

    const MOBILE_BREAKPOINT = 820;

    // Single source of truth for menu state
    let isMenuOpen = false;

    function setMenuState(open) {
        isMenuOpen = open && window.innerWidth <= MOBILE_BREAKPOINT;

        nav.classList.toggle("menu-open", isMenuOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isMenuOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    }

    // Toggle menu
    menuToggle.addEventListener("click", () => {
        setMenuState(!isMenuOpen);
    });

    // Close after navigation
    links.querySelectorAll("a").forEach(anchor => {
        anchor.addEventListener("click", () => {
            setMenuState(false);
        });
    });

    admission.addEventListener("click", () => {
        setMenuState(false);
    });

    // Close when clicking outside navbar
    document.addEventListener("click", event => {
        if (
            isMenuOpen &&
            !nav.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    // Close using Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && isMenuOpen) {
            setMenuState(false);
            menuToggle.focus();
        }
    });

    // Handle responsive breakpoint changes
    window.addEventListener("resize", () => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            setMenuState(false);
        }
    });

    // Active page navigation
    function setActiveLink() {
        const currentPath =
            window.location.pathname.replace(/\/+$/, "") || "/";

        links.querySelectorAll("a").forEach(anchor => {
            const href = anchor.getAttribute("href");

            if (!href || !href.startsWith("/")) return;

            const normalizedHref =
                href.replace(/\/+$/, "") || "/";

            const isCurrent =
                normalizedHref === "/"
                    ? currentPath === "/"
                    : currentPath === normalizedHref ||
                      currentPath.startsWith(normalizedHref + "/");

            anchor.classList.toggle("active", isCurrent);

            if (isCurrent) {
                anchor.setAttribute("aria-current", "page");
            } else {
                anchor.removeAttribute("aria-current");
            }
        });

        // Admission active state is separate from menu state
        const admissionPath = "/admission";
        const isAdmissionPage =
            currentPath === admissionPath ||
            currentPath.startsWith(admissionPath + "/");

        admission.classList.toggle(
            "is-current",
            isAdmissionPage
        );
    }

    // Initial state
    setMenuState(false);
    setActiveLink();
});
