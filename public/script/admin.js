/* ==============================================================
   ADMIN DASHBOARD – Per-Event Load-More (Gallery + Videos)
   ============================================================== */
document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------------
     1. LOGOUT CONFIRMATION (your original)
     -------------------------------------------------------------- */
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        location.href = '/stcolumbus/admin/manage/logout';
      }
    });
  }

  /* --------------------------------------------------------------
     2. SETTINGS
     -------------------------------------------------------------- */
  const IMAGES_PER_LOAD = 6;
  const VIDEOS_PER_LOAD = 6;

  /* --------------------------------------------------------------
     3. GALLERY: Load-More PER EVENT (inside .datesect)
     -------------------------------------------------------------- */
  const eventGroups = document.querySelectorAll('.gallery-header .event');
  eventGroups.forEach(event => {
    const dateSections = event.querySelectorAll('.datesect');
    
    dateSections.forEach(section => {
      const imgCards = Array.from(section.querySelectorAll('.img'));
      const total = imgCards.length;

      if (total <= IMAGES_PER_LOAD) return; // No need for button

      // Hide all beyond first 6
      imgCards.forEach((card, i) => {
        card.style.display = i < IMAGES_PER_LOAD ? 'flex' : 'none';
      });

      // Create Load More button
      const loadMoreBtn = document.createElement('button');
      loadMoreBtn.textContent = 'Load More';
      loadMoreBtn.className = 'load-more-event-btn';
      Object.assign(loadMoreBtn.style, {
        display: 'block',
        margin: '20px auto 10px',
        padding: '10px 18px',
        fontSize: '14px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s'
      });

      // Insert button right after the .images grid
      const imagesContainer = section.querySelector('.images');
      imagesContainer.after(loadMoreBtn);

      let shown = IMAGES_PER_LOAD;

      loadMoreBtn.addEventListener('click', () => {
        const start = shown;
        const end = Math.min(start + IMAGES_PER_LOAD, total);

        for (let i = start; i < end; i++) {
          imgCards[i].style.display = 'flex';
        }

        shown = end;

        if (shown >= total) {
          loadMoreBtn.remove();
        }
      });
    });
  });

  /* --------------------------------------------------------------
     4. VIDEOS: Load-More (inside .sixth-section-outer)
     -------------------------------------------------------------- */
  const videoOuter = document.querySelector('.sixth-section-outer');
  if (videoOuter) {
    const videoCards = Array.from(videoOuter.querySelectorAll('.sixth-section-card'));
    const total = videoCards.length;

    if (total > VIDEOS_PER_LOAD) {
      // Hide beyond first 6
      videoCards.forEach((card, i) => {
        card.style.display = i < VIDEOS_PER_LOAD ? 'block' : 'none';
      });

      const loadMoreBtn = document.createElement('button');
      loadMoreBtn.textContent = 'Load More Videos';
      loadMoreBtn.className = 'load-more-video-btn';
      Object.assign(loadMoreBtn.style, {
        display: 'block',
        margin: '30px auto',
        padding: '12px 24px',
        fontSize: '15px',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s'
      });

      videoOuter.after(loadMoreBtn);

      let shown = VIDEOS_PER_LOAD;

      loadMoreBtn.addEventListener('click', () => {
        const start = shown;
        const end = Math.min(start + VIDEOS_PER_LOAD, total);

        for (let i = start; i < end; i++) {
          videoCards[i].style.display = 'block';
        }

        shown = end;
        if (shown >= total) loadMoreBtn.remove();
      });
    }
  }
});