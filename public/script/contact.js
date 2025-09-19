const form = document.querySelector('.form-container');
  const userName = document.querySelector('.user-name');
  const userEmail = document.querySelector('.user-email');
  const userMessage = document.querySelector('.user-message');
  const locationInput = document.getElementById('userLocation');

  const namePattern = /^[A-Za-z\s]{3,30}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const messagePattern = /^.{10,200}$/; // 10 to 200 chars

  function validate(input, pattern, message) {
    const errorSpan = input.parentElement.querySelector('.error');
    if (!pattern.test(input.value.trim())) {
      errorSpan.textContent = message;
      return false;
    }
    errorSpan.textContent = "";
    return true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent default submission

    // Validate all fields
    const isNameValid = validate(userName, namePattern, "Name must be 3-30 letters only.");
    const isEmailValid = validate(userEmail, emailPattern, "Enter a valid email address.");
    
    // Message validation
    const messageLength = userMessage.value.trim().length;
    const messageError = userMessage.parentElement.querySelector('.error');
    let isMessageValid = true;
    if (messageLength < 10 || messageLength > 200) {
      messageError.textContent = "Message must be between 10-200 characters.";
      isMessageValid = false;
    } else {
      messageError.textContent = "";
    }

    if (isNameValid && isEmailValid && isMessageValid) {
      // Try to get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            locationInput.value = `${position.coords.latitude},${position.coords.longitude}`;
            form.submit(); // Submit form after location obtained
          },
          (error) => {
            alert("Location permission is required to submit the form.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  });


// GO TO TOP
const upArrow = document.getElementById( 'upArrow' );

upArrow.addEventListener( 'click', () => {
    window.scrollTo( {
        top: 0,
        behavior: 'smooth'
    } );
} );