const form = document.getElementById('contactForm');
const userName = document.querySelector('.user-name');
const userEmail = document.querySelector('.user-email');
const userMessage = document.querySelector('.user-message');
const locationInput = document.getElementById('userLocation');
const loading = document.getElementById('loading');
const responseMessage = document.getElementById('responseMessage');
const submitBtn = document.getElementById('submitBtn');

const namePattern = /^[A-Za-z\s]{3,30}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const messagePattern = /^.{10,200}$/; // exactly 10-200 characters

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
  e.preventDefault();
  responseMessage.textContent = "";

  // Validate name and email
  const isNameValid = validate(userName, namePattern, "Name must be 3-30 letters only.");
  const isEmailValid = validate(userEmail, emailPattern, "Enter a valid email address.");

  // Validate message length (10-200 characters)
  const isMessageValid = validate(userMessage, messagePattern, "Message must be between 10-200 characters.");

  // Stop submission if any validation fails
  if (!(isNameValid && isEmailValid && isMessageValid)) return;

  // Show loading spinner
  loading.style.display = "block";
  submitBtn.disabled = true;

  // Get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        locationInput.value = `${position.coords.latitude},${position.coords.longitude}`;
        sendForm();
      },
      (error) => {
        loading.style.display = "none";
        submitBtn.disabled = false;
        alert("Location permission is required to submit the form.");
      }
    );
  } else {
    loading.style.display = "none";
    submitBtn.disabled = false;
    alert("Geolocation is not supported by your browser.");
  }
});

function sendForm() {
  const formData = {
    name: userName.value.trim(),
    email: userEmail.value.trim(),
    mess: userMessage.value.trim(),
    location: locationInput.value
  };

  fetch("/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then(async (res) => {
      const data = await res.json();
      loading.style.display = "none";
      submitBtn.disabled = false;

      if (!res.ok) {
        // Handle duplicate email or other server errors
        responseMessage.style.color = "red";
        responseMessage.textContent = data.message;
        return;
      }

      // Success
      responseMessage.style.color = "green";
      responseMessage.textContent = data.message;
      form.reset();
    })
    .catch(err => {
      loading.style.display = "none";
      submitBtn.disabled = false;
      responseMessage.style.color = "red";
      responseMessage.textContent = "Failed to send message. Please try again.";
      console.error(err);
    });
}


// GO TO TOP
const upArrow = document.getElementById('upArrow');
upArrow.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
