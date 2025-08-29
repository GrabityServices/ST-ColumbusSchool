// Image Container
// const images = [
//     '/images/1.jpg',
//     '/images/2.jpg',
//     '/images/3.jpg',
//     '/images/4.jpg',
//     '/images/5.jpg',
// ];


// For animated text
const typed = new Typed( '.heart-text', {
    strings: [ "Heart Of Nature", "Roots Of Traditions", "Journey Of Discovery", "Diversity Of Ideas" ],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 500,
    loop: true
} )

const slides = document.querySelectorAll( '.slide' );
const increment = document.querySelector( '.increment' );
const teacherIncrement = document.querySelector( '.teacher-increment' );
const school = document.querySelector( '.school' );
// const firstImage = document.querySelector( '.firstImageTag' );
// const centerImage = document.querySelector( '.centerImageTag' );
// const lastImage = document.querySelector( '.lastImageTag' );
let currentIndex = 0;

// For image slider
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

// Previous button
document.getElementById( 'prev' ).addEventListener( 'click', () => {
    currentIndex = ( currentIndex - 1 + slides.length ) % slides.length;
    goToSlide( currentIndex );
} );

// Next button
document.getElementById( 'next' ).addEventListener( 'click', () => {
    currentIndex = ( currentIndex + 1 ) % slides.length;
    goToSlide( currentIndex );
} );

// Number increment for students
setTimeout( () => {
    let i = 0;
    let interval = setInterval( () => {
        increment.innerText = `${ i }+`;
        if ( i >= 2000 ) {
            clearInterval( interval );
        }
        i++;
    }, 8 ); // update every 5ms
}, 3000 );

// Number Increment for teachers
setTimeout( () => {
    let i = 0;
    let interval = setInterval( () => {
        teacherIncrement.innerText = `${ i }+`;
        if ( i >= 50 ) {
            clearInterval( interval );
        }
        i++;
    }, 300 );
}, 3000 );

// Number increment for school
setTimeout( () => {
    let i = 0;
    let interval = setInterval( () => {
        school.innerText = `${ i }`;
        if ( i >= 2 ) {
            clearInterval( interval );
        }
        i++;
    }, 300 );
}, 3000 );




// // Image Container
const images = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
];

// Gallery Slider Code
const firstImage = document.querySelector( '.firstImageTag' );
const centerImage = document.querySelector( '.centerImageTag' );
const lastImage = document.querySelector( '.lastImageTag' );

let index = 0;
function updateImages () {
    firstImage.setAttribute( 'src', images[ index % images.length ] );
    centerImage.setAttribute( 'src', images[ ( index + 1 ) % images.length ] );
    lastImage.setAttribute( 'src', images[ ( index + 2 ) % images.length ] );
    index++;
}
setInterval( updateImages, 2000 );
updateImages();
