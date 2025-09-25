// FILTER
const filterLinks = document.querySelectorAll( '.gallery-options a' );
const sections = {
  all: document.querySelector( '.all' ),
  date: document.querySelector( '.bydate' ),
  title: document.querySelector( '.bytitle' )
};

filterLinks.forEach( link => {
  link.addEventListener( 'click', e => {
    e.preventDefault();

    // Remove active class from all links and add to current
    filterLinks.forEach( l => l.classList.remove( 'active' ) );
    link.classList.add( 'active' );

    const filter = link.dataset.filter;

    // Show the selected section, hide others
    for ( let key in sections ) {
      if ( key === filter ) {
        sections[ key ].style.display = 'grid'; // important: always use grid
      } else {
        sections[ key ].style.display = 'none';
      }
    }

    // Ensure all images have fixed height
    const imgs = document.querySelectorAll( '.gallery-image-card img' );
    imgs.forEach( img => {
      img.style.height = '100%';
      img.style.width = '100%';
      img.style.objectFit = 'cover';
    } );
  } );
} );


// IMAGE POPUP
const galleryImages = document.querySelectorAll( '.gallery-image-card img' );
const popup = document.querySelector( '.popup' );
const popupImg = document.querySelector( '.popup-img' );
const closeBtn = document.querySelector( '.close-btn' );

galleryImages.forEach( img => {
  img.addEventListener( 'click', () => {
    popup.style.display = 'flex';
    popupImg.src = img.src;
  } );
} );

closeBtn.addEventListener( 'click', () => popup.style.display = 'none' );
popup.addEventListener( 'click', e => {
  if ( e.target === popup ) popup.style.display = 'none';
} );




// LOAD MORE
document.addEventListener( 'DOMContentLoaded', () => {

  const allSection = document.querySelector( '.gallery-section.all' );
  const allCards = Array.from( allSection.querySelectorAll( '.gallery-image-card' ) );
  const increment = 12; // images to show at a time
  let currentIndex = increment;

  // Hide images beyond the first increment
  allCards.forEach( ( card, index ) => {
    if ( index >= increment ) card.style.display = 'none';
  } );

  // Only add Load More button if needed
  let loadMoreBtn;
  if ( allCards.length > increment ) {
    loadMoreBtn = document.createElement( 'button' );
    loadMoreBtn.id = 'loadMoreBtn';
    loadMoreBtn.textContent = 'Load More';

    Object.assign( loadMoreBtn.style, {
      display: 'block',
      margin: '20px auto',
      padding: '10px 25px',
      fontSize: '16px',
      fontWeight: 'bold',
      backgroundColor: '#177474',
      color: '#fff',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: '0.3s',
      textAlign: 'center'
    } );

    loadMoreBtn.addEventListener( 'mouseenter', () => {
      loadMoreBtn.style.backgroundColor = '#00a3a3';
    } );
    loadMoreBtn.addEventListener( 'mouseleave', () => {
      loadMoreBtn.style.backgroundColor = '#177474';
    } );

    allSection.after( loadMoreBtn );

    loadMoreBtn.addEventListener( 'click', () => {
      const nextCards = allCards.slice( currentIndex, currentIndex + increment );
      nextCards.forEach( card => card.style.display = 'block' );
      currentIndex += increment;
      if ( currentIndex >= allCards.length ) loadMoreBtn.style.display = 'none';
    } );
  }

  // Hide button when switching sections
  const filterLinks = document.querySelectorAll( '.gallery-options a' );
  filterLinks.forEach( link => {
    link.addEventListener( 'click', () => {
      if ( loadMoreBtn ) {
        if ( link.dataset.filter !== 'all' ) {
          loadMoreBtn.style.display = 'none';
        } else {
          // Only show if there are still hidden images
          loadMoreBtn.style.display = ( currentIndex < allCards.length ) ? 'block' : 'none';
        }
      }
    } );
  } );

} );
