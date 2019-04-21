const registerForm = document.querySelector('#register-form');
const loginForm = document.querySelector('#login-form');

function getValues(evt, form) {
  evt.preventDefault();
  const { elements } = form;
  const values = {};
  for (let i = 0; i < elements.length - 1; i += 1) {
    const item = elements.item(i);
    values[item.name] = item.value;
  }
  return values;
}

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
