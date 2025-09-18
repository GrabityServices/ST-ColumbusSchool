const checkbox = document.getElementById( "byDate" );
const byDateGallery = document.querySelector( ".byDate" );
const byTitleGallery = document.querySelector( ".byTitle" );

checkbox.addEventListener( "change", () => {
    if ( checkbox.checked ) {
        byDateGallery.style.display = "block";
        byTitleGallery.style.display = "none";
    } else {
        byDateGallery.style.display = "none";
        byTitleGallery.style.display = "block";
    }
} );

// Initialize the display based on the checkbox state
if ( checkbox.checked ) {
    byDateGallery.style.display = "block";
    byTitleGallery.style.display = "none";
} else {
    byDateGallery.style.display = "none";
    byTitleGallery.style.display = "block";
}

const toggleGallery = document.getElementById( "toggle-gallery" );


