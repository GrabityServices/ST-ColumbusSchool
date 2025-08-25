const slides = document.querySelectorAll( '.slide' );
let currentIndex = 0;

function goToSlide ( index ) {
    slides.forEach( ( slide, i ) => {
        // Reset animation
        slide.style.animation = "none";
        slide.offsetHeight; // force reflow
        slide.style.animation = "";
        slide.style.animation = "slide 12s infinite";
        slide.style.animationDelay = ( ( i - index ) * 3 ) + "s"; // shift slides
    } );
}

document.getElementById( 'prev' ).addEventListener( 'click', () => {
    currentIndex = ( currentIndex - 1 + slides.length ) % slides.length;
    goToSlide( currentIndex );
} );

document.getElementById( 'next' ).addEventListener( 'click', () => {
    currentIndex = ( currentIndex + 1 ) % slides.length;
    goToSlide( currentIndex );
} );