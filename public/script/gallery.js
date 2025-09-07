// GALLERY POPUP
const imageSources = document.querySelectorAll( '.gallery-image-card img' );
const popup = document.querySelector( '.popup' );
const popupImg = document.querySelector( '.popup-img' );
const closeBtn = document.querySelector( '.close-btn' );

imageSources.forEach( img => {
    img.addEventListener( 'click', () => {
        popup.style.display = 'flex';  
        popupImg.src = img.src;        
    } );
} );

closeBtn.addEventListener( 'click', () => {
    popup.style.display = 'none';
} );

popup.addEventListener( 'click', ( e ) => {
    if ( e.target === popup ) {
        popup.style.display = 'none';
    }
} );
