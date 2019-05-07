const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');

registerForm.addEventListener('submit', (evt) => {
  const values = getValues(evt, registerForm);
  console.log(values);
});
loginForm.addEventListener('submit', (evt) => {
  const values = getValues(evt, loginForm);
  const { password } = values;
  if (password === 'admin') {
    window.location.href = './admin.html';
  } else {
    window.location.href = './dashboard.html';
  }
  console.log(values);
});
