const hamburger = document.querySelector( '.hamburger' );
const links = document.querySelector( '.links' );
const admission = document.querySelector( '.admission' );

hamburger.addEventListener( 'click', () => {
    const isActive = hamburger.classList.toggle( 'active' );
    if ( isActive ) {
        links.style.display = 'flex';
        admission.style.display = 'flex';
        requestAnimationFrame( () => {
            links.classList.add( 'active' );
            admission.classList.add( 'active' );
        } );
    } else {
        links.classList.remove( 'active' );
        admission.classList.remove( 'active' );
        setTimeout( () => {
            links.style.display = 'none';
            admission.style.display = 'none';
        }, 300 ); 
    }
    hamburger.setAttribute( 'aria-expanded', isActive );
} );