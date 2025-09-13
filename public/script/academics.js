const upArrow = document.getElementById( 'upArrow' );

upArrow.addEventListener( 'click', () => {
    window.scrollTo( {
        top: 0,
        behavior: 'smooth'
    } );
} );