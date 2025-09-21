// For animated text
const typed = new Typed( '.heart-text', {
    strings: [ "Heart Of Nature", "Roots Of Traditions", "Journey Of Discovery", "Diversity Of Ideas" ],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 500,
    loop: true
} )

const increment = document.querySelector( '.increment' );
const teacherIncrement = document.querySelector( '.teacher-increment' );
const school = document.querySelector( '.school' );
const area = document.querySelector( '.area' );


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

// Number increment for area
setTimeout( () => {
    let i = 0;
    let interval = setInterval( () => {
        area.innerText = `${ i }+`;
        if ( i >= 10 ) {
            clearInterval( interval );
        }
        i++;
    }, 500 );
}, 3000 );


// Change the image on click at faq section
const faqs = document.querySelectorAll( '.faq-item' );

faqs.forEach( faq => {
    faq.querySelector( '.faq-question' ).addEventListener( 'click', () => {
        // Close all other FAQ answers
        faqs.forEach( f => {
            if ( f !== faq ) {
                f.classList.remove( 'active' );
                f.querySelector( 'img' ).src = '/images/icon-plus.svg';
                f.querySelector( '.faq-answer' ).style.maxHeight = 0;
            }
        } );

        // Toggle current FAQ
        const answer = faq.querySelector( '.faq-answer' );
        faq.classList.toggle( 'active' );
        faq.classList.contains( 'active' )
            ? answer.style.maxHeight = 150 + "px"
            : answer.style.maxHeight = 0;

        // Toggle icon
        faq.querySelector( 'img' ).src = faq.classList.contains( 'active' )
            ? '/images/icon-minus.svg'
            : '/images/icon-plus.svg';
    } );
} );


// Up Arrow animation
const upArrow = document.getElementById( 'upArrow' );
upArrow.addEventListener( 'click', () => {
    window.scrollTo( {
        top: 0,
        behavior: 'smooth'
    } );
} );



// SECOND IMAGE SLIDER
let currentSlide = 0;
const secondSlides = document.querySelectorAll( '.second-slide' );
const totalSlides = secondSlides.length;

function updateSlider () {
    secondSlides.forEach( ( slide, index ) => {
        slide.classList.remove(
            'center', 'left', 'right',
            'leave-left', 'leave-right',
            'enter-left', 'enter-right'
        );

        // Each slide’s inner text
        const innerText = slide.querySelector( '.second-slider-image-inner-text' );

        if ( index === currentSlide ) {
            slide.classList.add( 'center' );
            innerText.style.display = 'flex'; 
        } else {
            innerText.style.display = 'none';  // Hide others
            if ( index === ( currentSlide + 1 ) % totalSlides ) {
                slide.classList.add( 'right' );
            } else if ( index === ( currentSlide - 1 + totalSlides ) % totalSlides ) {
                slide.classList.add( 'left' );
            } else {
                if (
                    ( index < currentSlide && currentSlide - index <= totalSlides / 2 ) ||
                    ( index > currentSlide && index - currentSlide > totalSlides / 2 )
                ) {
                    slide.classList.add( 'leave-left' );
                } else {
                    slide.classList.add( 'leave-right' );
                }
            }
        }
    } );
}

function nextSlide () {
    currentSlide = ( currentSlide + 1 ) % totalSlides;
    updateSlider();
}

updateSlider();
setInterval( nextSlide, 3000 );



