class SyncedSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        this.slides = this.slider.querySelectorAll('.slide');
        this.progress = this.slider.querySelector('.progress-bar');
        this.prevBtn = this.slider.querySelector('.nav-btn.prev');
        this.nextBtn = this.slider.querySelector('.nav-btn.next');
        this.dotsContainer = this.slider.querySelector('.dots');
        this.current = 0;
        this.total = this.slides.length;
        this.delay = 6000;
        this.isAnimating = false;

        this.createDots();
        this.updateDots();
        this.bindEvents();
        this.updateButtonPreviews();
        this.startProgress();
    }

    createDots() {
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => this.manualGoTo(i));
            this.dotsContainer.appendChild(dot);
        }
        this.dots = this.dotsContainer.querySelectorAll('.dot');
    }

    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.manualNext());
        this.prevBtn.addEventListener('click', () => this.manualPrev());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.manualNext();
            if (e.key === 'ArrowLeft') this.manualPrev();
        });
        this.progress.addEventListener('animationend', () => {
            this.next();
        });
    }

    goTo(index, direction = 'right') {
        if (this.isAnimating || index === this.current) return;
        this.isAnimating = true;

        const currentSlide = this.slides[this.current];
        const nextSlide = this.slides[(index + this.total) % this.total];
        const offset = direction === 'right' ? '100%' : '-100%';

        this.slides.forEach(slide => slide.classList.remove('exiting'));

        nextSlide.style.transition = 'none';
        nextSlide.style.transform = `translateX(${offset})`;
        nextSlide.style.opacity = '1';
        nextSlide.classList.add('active');

        requestAnimationFrame(() => {
            currentSlide.classList.add('exiting');
            nextSlide.style.transition = 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out';
            currentSlide.style.transition = 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out';
            currentSlide.style.transform = direction === 'right' ? 'translateX(-100%)' : 'translateX(100%)';
            nextSlide.style.transform = 'translateX(0)';
        });

        const caption = nextSlide.querySelector('.caption-box');
        caption.style.animation = 'none';
        void caption.offsetWidth;
        caption.style.animation = 'boxSlideIn 1.4s cubic-bezier(0.77, 0, 0.175, 1) forwards';

        setTimeout(() => {
            currentSlide.classList.remove('active', 'exiting');
            currentSlide.style.transition = '';
            currentSlide.style.transform = '';
            this.current = (index + this.total) % this.total;
            this.updateDots();
            this.updateButtonPreviews();
            this.resetProgress();
            this.isAnimating = false;
        }, 1000);
    }

    manualGoTo(index) {
        this.clearProgress();
        this.goTo(index);
    }

    next() {
        this.goTo(this.current + 1, 'right');
    }

    prev() {
        this.goTo(this.current - 1, 'left');
    }

    manualNext() {
        this.clearProgress();
        this.next();
    }

    manualPrev() {
        this.clearProgress();
        this.prev();
    }

    updateDots() {
        this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.current));
    }

    updateButtonPreviews() {
        const nextIndex = (this.current + 1) % this.total;
        const prevIndex = (this.current - 1 + this.total) % this.total;
        this.nextBtn.querySelector('img').src = this.slides[nextIndex].querySelector('img').src;
        this.prevBtn.querySelector('img').src = this.slides[prevIndex].querySelector('img').src;
    }

    startProgress() {
        this.progress.style.animation = `progress ${this.delay}ms linear forwards`;
    }

    resetProgress() {
        this.progress.style.animation = 'none';
        void this.progress.offsetWidth;
        this.progress.style.animation = `progress ${this.delay}ms linear forwards`;
    }

    clearProgress() {
        this.progress.style.animation = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SyncedSlider('.slider');
});






// For animated text
const typed = new Typed('.heart-text', {
    strings: ["Heart Of Nature", "Roots Of Traditions", "Journey Of Discovery", "Diversity Of Ideas"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 500,
    loop: true
})

const increment = document.querySelector('.increment');
const teacherIncrement = document.querySelector('.teacher-increment');
const school = document.querySelector('.school');
const area = document.querySelector('.area');


// Number increment for students
setTimeout(() => {
    let i = 0;
    let interval = setInterval(() => {
        increment.innerText = `${i}+`;
        if (i >= 700) {
            clearInterval(interval);
        }
        i++;
    }, 8); // update every 5ms
}, 3000);

// Number Increment for teachers
setTimeout(() => {
    let i = 0;
    let interval = setInterval(() => {
        teacherIncrement.innerText = `${i}+`;
        if (i >= 20) {
            clearInterval(interval);
        }
        i++;
    }, 300);
}, 3000);

// Number increment for school
setTimeout(() => {
    let i = 0;
    let interval = setInterval(() => {
        school.innerText = `${i}`;
        if (i >= 2) {
            clearInterval(interval);
        }
        i++;
    }, 300);
}, 3000);

// Number increment for area
setTimeout(() => {
    let i = 0;
    let interval = setInterval(() => {
        area.innerText = `${i}+`;
        if (i >= 5) {
            clearInterval(interval);
        }
        i++;
    }, 500);
}, 3000);


// Change the image on click at faq section
const faqs = document.querySelectorAll('.faq-item');

faqs.forEach(faq => {
    faq.querySelector('.faq-question').addEventListener('click', () => {
        // Close all other FAQ answers
        faqs.forEach(f => {
            if (f !== faq) {
                f.classList.remove('active');
                f.querySelector('img').src = '/images/icons/icon-plus.svg';
                f.querySelector('.faq-answer').style.maxHeight = 0;
            }
        });

        // Toggle current FAQ
        const answer = faq.querySelector('.faq-answer');
        faq.classList.toggle('active');
        faq.classList.contains('active')
            ? answer.style.maxHeight = 150 + "px"
            : answer.style.maxHeight = 0;

        // Toggle icon
        faq.querySelector('img').src = faq.classList.contains('active')
            ? '/images/icons/icon-minus.svg'
            : '/images/icons/icon-plus.svg';
    });
});


// Up Arrow animation
const upArrow = document.getElementById('upArrow');
upArrow.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});



// SECOND IMAGE SLIDER
let currentSlide = 0;
const secondSlides = document.querySelectorAll('.second-slide');
const totalSlides = secondSlides.length;

function updateSlider() {
    secondSlides.forEach((slide, index) => {
        slide.classList.remove(
            'center', 'left', 'right',
            'leave-left', 'leave-right',
            'enter-left', 'enter-right'
        );

        // Each slide’s inner text
        const innerText = slide.querySelector('.second-slider-image-inner-text');

        if (index === currentSlide) {
            slide.classList.add('center');
            innerText.style.display = 'flex';
        } else {
            innerText.style.display = 'none';  // Hide others
            if (index === (currentSlide + 1) % totalSlides) {
                slide.classList.add('right');
            } else if (index === (currentSlide - 1 + totalSlides) % totalSlides) {
                slide.classList.add('left');
            } else {
                if (
                    (index < currentSlide && currentSlide - index <= totalSlides / 2) ||
                    (index > currentSlide && index - currentSlide > totalSlides / 2)
                ) {
                    slide.classList.add('leave-left');
                } else {
                    slide.classList.add('leave-right');
                }
            }
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

updateSlider();
setInterval(nextSlide, 3000);


(function () {
  "use strict";

  if (!("serviceWorker" in navigator)) return;

  const toast = document.getElementById("websiteUpdateToast");
  const updateButton = document.getElementById("updateWebsiteNow");
  const dismissButton = document.getElementById("dismissWebsiteUpdate");

  if (!toast || !updateButton || !dismissButton) return;

  let registration;
  let updateAccepted = false;
  let refreshing = false;

  function showUpdateNotification() {
    if (!registration?.waiting) return;

    toast.classList.add("show");
  }

  function hideUpdateNotification() {
    toast.classList.remove("show");
  }

  async function initializeServiceWorker() {
    try {
      registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/"
      });

      await navigator.serviceWorker.ready;

      // Check whether an updated worker is already waiting.
      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdateNotification();
      }

      // Detect newly installed service worker.
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            showUpdateNotification();
          }
        });
      });

      // Check the server for a new version.
      await registration.update();

    } catch (error) {
      console.error("Website update check failed:", error);
    }
  }

  // User accepts the update.
  updateButton.addEventListener("click", () => {
    if (!registration?.waiting) return;

    updateAccepted = true;
    updateButton.disabled = true;
    updateButton.textContent = "Updating...";

    registration.waiting.postMessage({
      type: "SKIP_WAITING"
    });
  });

  // User dismisses the notification.
  dismissButton.addEventListener("click", hideUpdateNotification);

  // Reload only after the user accepts the update.
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (updateAccepted && !refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  initializeServiceWorker();

  // Periodically check for updates while the page remains open.
  document.addEventListener("visibilitychange", () => {
    if (
      document.visibilityState === "visible" &&
      registration
    ) {
      registration.update().catch(console.error);
    }
  });

})();

