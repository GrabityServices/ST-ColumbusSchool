// FILTER
const filterLinks = document.querySelectorAll('.gallery-options a');
const sections = {
  all: document.querySelector('.all'),
  date: document.querySelector('.bydate'),
  title: document.querySelector('.bytitle')
};

filterLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Remove active class from all links and add to current
    filterLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const filter = link.dataset.filter;

    // Show the selected section, hide others
    for (let key in sections) {
      if (key === filter) {
        sections[key].style.display = 'grid'; // important: always use grid
      } else {
        sections[key].style.display = 'none';
      }
    }

    // Ensure all images have fixed height
    const imgs = document.querySelectorAll('.gallery-image-card img');
    imgs.forEach(img => {
      img.style.height = '100%';
      img.style.width = '100%';
      img.style.objectFit = 'cover';
    });
  });
});


// IMAGE POPUP
const galleryImages = document.querySelectorAll('.gallery-image-card img');
const popup = document.querySelector('.popup');
const popupImg = document.querySelector('.popup-img');
const closeBtn = document.querySelector('.close-btn');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    popup.style.display = 'flex';
    popupImg.src = img.src;
  });
});

closeBtn.addEventListener('click', () => popup.style.display = 'none');
popup.addEventListener('click', e => {
  if (e.target === popup) popup.style.display = 'none';
});
