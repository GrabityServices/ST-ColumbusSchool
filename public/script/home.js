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


// Increment
// for(let i = 0;i<=2000;i++)
// {
//     setTimeout(()=>{
//         increment.innerText = `${i}+`
//     },5000)
// }


// setTimeout( () => {
//     for ( let i = 0; i <= 2000; i++ ) {
//         setTimeout( () => {
//             increment.innerText = `${ i }+`;
//         }, 500 )
//     }
// }, 5000 )


setTimeout( () => {
    let i = 0;
    let interval = setInterval( () => {
        increment.innerText = `${ i }+`;
        if ( i >= 2000 ) {
            clearInterval( interval ); 
        }
        i++;
    }, 70 ); // update every 5ms
}, 3000 );


setTimeout( () => {
    let i = 0;
    let interval = setInterval( () => {
        teacherIncrement.innerText = `${ i }+`;
        if ( i >= 50 ) {
            clearInterval( interval );
        }
        i++;
    }, 300 ); // update every 5ms
}, 3000 );



setTimeout( () => {
    let i = 0;
    let interval = setInterval( () => {
        school.innerText = `${ i }+`;
        if ( i >= 2 ) {
            clearInterval( interval );
        }
        i++;
    }, 900 ); // update every 5ms
}, 3000 );

