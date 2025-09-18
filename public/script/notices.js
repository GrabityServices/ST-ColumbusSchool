// GO TO TOP
const upArrow = document.getElementById( 'upArrow' );

upArrow.addEventListener( 'click', () => {
    window.scrollTo( {
        top: 0,
        behavior: 'smooth'
    } );
} );


// TO DOWNLOAD THE NOTICE
function openAndDownload(event, url) {
    event.preventDefault(); // stop normal link behavior

    // 1. Open in a new tab
    window.open(url, "_blank");

    // 2. Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop(); 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}