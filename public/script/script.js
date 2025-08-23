const hamburger = document.querySelector( '.hamburger' );
const links = document.querySelector( '.links' );
const admission = document.querySelector( '.admission' );

hamburger.addEventListener( 'click', () => {
    const isActive = hamburger.classList.toggle( 'active' );
    if ( isActive ) {
        // Show elements and start animation
        links.style.display = 'flex';
        admission.style.display = 'flex';
        // Use requestAnimationFrame to ensure display is set before animation starts
        requestAnimationFrame( () => {
            links.classList.add( 'active' );
            admission.classList.add( 'active' );
        } );
    } else {
        // Start animation to slide out, then hide elements
        links.classList.remove( 'active' );
        admission.classList.remove( 'active' );
        // Wait for animation to complete before hiding
        setTimeout( () => {
            links.style.display = 'none';
            admission.style.display = 'none';
        }, 300 ); // Match the CSS transition duration (0.3s)
    }
    hamburger.setAttribute( 'aria-expanded', isActive );
} );