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

// GO TO TOP
const upArrow = document.getElementById( 'upArrow' );
upArrow.addEventListener( 'click', () => {
    window.scrollTo( {
        top: 0,
        behavior: 'smooth'
    } );
} );


const as = document.querySelectorAll( ".gallery-options a" );
const all = document.querySelector( ".all" );
const bydate = document.querySelector( ".bydate" );
const byevename = document.querySelector( ".byevename" );
as.forEach( ( a, idx ) => {
    a.addEventListener( "click", () => {
        as.forEach( ( link ) => link.classList.remove( "active" ) );
        a.classList.add( "active" );
        const name = a.innerText;
        if ( name === "All" ) {
            bydate.style.display = "none";
            byevename.style.display = "none";
            all.style.display = "block";
        } else if ( name == "Arranged by Date" ) {
            bydate.style.display = "block";
            byevename.style.display = "none";
            all.style.display = "none";
        } else {
            bydate.style.display = "none";
            byevename.style.display = "block";
            all.style.display = "none";
        }
    } );
} );