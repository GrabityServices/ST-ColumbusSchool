const galleryInner = document.querySelector('.gallery-inner')
const galleryOptions = document.querySelector('.gallery-options')
galleryInner.classList.add('animation-show')
galleryOptions.classList.add('animation-show')

/* ==============================================================
   GALLERY – FILTER + LOAD-MORE (All sections)
   ============================================================== */
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- SELECTORS ---------- */
  const filterLinks = document.querySelectorAll('.gallery-options a');
  const sections = {
    all   : document.querySelector('.gallery-section.all'),
    date  : document.querySelector('.gallery-section.bydate'),
    title : document.querySelector('.gallery-section.bytitle'),
    video : document.querySelector('.gallery-section.video')
  };

  const cardSelectors = {
    all   : '.gallery-section.all   .gallery-image-card',
    date  : '.gallery-section.bydate .gallery-image-card',
    title : '.gallery-section.bytitle .gallery-image-card',
    video : '.gallery-section.video  .sixth-section-card'
  };

  /* ---------- SETTINGS ---------- */
  const INCREMENT   = 12;               // cards per “Load More”
  const currentIdx  = {};               // currentIdx[filter] = last shown index
  let   activeBtn   = null;             // reference to the current Load-More button

  /* ---------- BUTTON FACTORY ---------- */
  function createLoadMoreBtn(filter) {
    const btn = document.createElement('button');
    btn.id = `loadMoreBtn-${filter}`;
    btn.textContent = 'Load More';
    Object.assign(btn.style, {
      display: 'block',
      margin: '30px auto 0',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: 'bold',
      backgroundImage: 'linear-gradient(135deg, #ff6551 0%, #ffb4a4 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color .3s',
      textAlign: 'center'
    });

    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#00a3a3');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '');

    btn.addEventListener('click', () => loadMore(filter));
    return btn;
  }

  /* ---------- REMOVE CURRENT BUTTON ---------- */
  function removeActiveBtn() {
    if (activeBtn && activeBtn.parentNode) {
      activeBtn.parentNode.removeChild(activeBtn);
    }
    activeBtn = null;
  }

  /* ---------- INITIALISE A SECTION ---------- */
  function initSection(filter) {
    const section  = sections[filter];
    const selector = cardSelectors[filter];
    const cards    = Array.from(section.querySelectorAll(selector));

    // reset index
    currentIdx[filter] = INCREMENT;

    // show first batch, hide the rest
    cards.forEach((c, i) => {
      c.style.display = i < INCREMENT ? 'block' : 'none';
    });

    // clean old button
    removeActiveBtn();

    // create new button only if more cards exist
    if (cards.length > INCREMENT) {
      const btn = createLoadMoreBtn(filter);
      section.after(btn);
      activeBtn = btn;
    }
  }

  /* ---------- LOAD NEXT BATCH ---------- */
  function loadMore(filter) {
    const section  = sections[filter];
    const selector = cardSelectors[filter];
    const cards    = Array.from(section.querySelectorAll(selector));
    const start    = currentIdx[filter];
    const end      = Math.min(start + INCREMENT, cards.length);

    for (let i = start; i < end; i++) {
      cards[i].style.display = 'block';
    }

    currentIdx[filter] = end;

    // hide button when everything is shown
    if (end >= cards.length && activeBtn) {
      activeBtn.style.display = 'none';
    }
  }

  /* ---------- FILTER LINK CLICK ---------- */
  filterLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      const filter = link.dataset.filter;   // all | date | title | video

      // ---- UI: active link
      filterLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // ---- Show / hide sections
      Object.entries(sections).forEach(([key, sec]) => {
        sec.style.display = key === filter ? 'grid' : 'none';
      });

      // ---- Initialise Load-More for the new section
      initSection(filter);

      // ---- Keep image sizing consistent
      document.querySelectorAll('.gallery-image-card img').forEach(img => {
        img.style.height = '100%';
        img.style.width  = '100%';
        img.style.objectFit = 'cover';
      });
    });
  });

  /* ---------- IMAGE POPUP ---------- */
  const popup    = document.querySelector('.popup');
  const popupImg = document.querySelector('.popup-img');
  const closeBtn = document.querySelector('.close-btn');

  document.querySelectorAll('.gallery-image-card img').forEach(img => {
    img.addEventListener('click', () => {
      popup.style.display = 'flex';
      popupImg.src = img.src;
    });
  });

  closeBtn.addEventListener('click', () => popup.style.display = 'none');
  popup.addEventListener('click', e => { if (e.target === popup) popup.style.display = 'none'; });

  /* ---------- STARTUP – default view = All ---------- */
  initSection('all');

  /* ---------- SMOOTH SCROLL TO TOP (if you have an arrow) ---------- */
  const upArrow = document.getElementById('upArrow');
  if (upArrow) {
    upArrow.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
});