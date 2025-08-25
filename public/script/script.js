const link = document.querySelector( ".links" );
const menuIcon = document.getElementById( "menu-bar" );
const admission = document.querySelector( ".admission" );

menuIcon.addEventListener( "click", () => {
    if ( menuIcon.classList.contains( "fa-bars" ) ) {
        menuIcon.classList.add( "fa-xmark" );
        menuIcon.classList.remove( "fa-bars" );

        link.style.display = "flex";
        admission.style.display = "flex";

        requestAnimationFrame( () => {
            link.classList.add( "active" );
            admission.classList.add( "active" );
        } );
    } else {
        menuIcon.classList.remove( "fa-xmark" );
        menuIcon.classList.add( "fa-bars" );

        link.classList.remove( "active" );
        admission.classList.remove( "active" );
    }
} );
