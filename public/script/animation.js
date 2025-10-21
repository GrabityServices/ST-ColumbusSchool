const animatedElements = document.querySelectorAll('.animate');

function checkAnimation() {
    const triggerHeight = window.innerHeight * 0.9; // trigger at 85% of viewport

    animatedElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerHeight) {
            setTimeout(() => el.classList.add('show'), index * 100);
        } else {
            el.classList.remove('show');
        }
    });
}

window.addEventListener('scroll', () => requestAnimationFrame(checkAnimation));
window.addEventListener('load', checkAnimation);
