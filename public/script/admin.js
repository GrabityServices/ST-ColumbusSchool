// LOGOUT CONFIRMATION MESSAGE
const logoutBtn = document.getElementById( "logout-btn" );
if ( logoutBtn ) {
    logoutBtn.addEventListener( "click", function () {
        if ( confirm( "Are you sure you want to logout?" ) ) {
            location.href = '/stcolumbus/admin/manage/logout';
        }
    } );
}
