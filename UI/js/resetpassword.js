const reset = document.getElementById('reset-password');
const forgotPassword = document.getElementById('forgot-password');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const message = document.querySelector('.offset');

// Retrieve token from url
// const urlParams = new URLSearchParams(window.location.search);
// const resetToken = urlParams.get('token');

/** Check that password and Confirm Password are the same */
const check = () => {
  if (password.value !== confirmPassword.value) {
    message.style.color = 'red';
    message.innerHTML = 'Passwords do not match';
    return false;
  } return true;
};

if (password && confirmPassword) {
  /** Clear Error message  */
  [password, confirmPassword].forEach((elem) => {
    elem.addEventListener('input', () => {
      message.innerHTML = '';
    });
  });
}

if (reset) {
  reset.addEventListener('submit', (e) => {
    e.preventDefault();
    const matching = check();
    if (matching) {
      // Do something
    }
  });
}

if (forgotPassword) {
  forgotPassword.addEventListener('submit', (e) => {
    e.preventDefault();
    // Do Something
  });
}
