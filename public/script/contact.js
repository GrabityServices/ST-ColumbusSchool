const form = document.querySelector( '.form-container' );
const userName = document.querySelector( '.user-name' );
const userEmail = document.querySelector( '.user-email' );
const userMessage = document.querySelector( '.user-message' );

const namePattern = /^[A-Za-z\s]{3,30}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const messagePattern = /^.{10,500}$/;

function validate ( input, pattern, message ) {
    const errorSpan = input.parentElement.querySelector( '.error' );
    if ( !pattern.test( input.value ) ) {
        errorSpan.textContent = message;
        return false;
    }
    errorSpan.textContent = "";
    return true;
}

form.addEventListener( 'submit', e => {
    e.preventDefault();

    const isValid =
        validate( userName, namePattern, "Name must be 3-30 letters only." ) &
        validate( userEmail, emailPattern, "Enter a valid email address." ) &
        validate( userMessage, messagePattern, "Message must be 10-500 characters." );

    if ( isValid ) {
        alert( "Form submitted successfully!" );
        form.reset();
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