const menuToggle = document.querySelector('.menu-toggle'); // Menu Toggle
const navBar = document.querySelector('nav'); // Menu Toggle
const loanAmount = document.getElementById('loan-amount');
const loanTerm = document.getElementById('loan-term');
const amountDisplay = document.querySelectorAll('.amount-display');
const termDisplay = document.querySelectorAll('.term-display');
const interestDisplay = document.querySelector('.total-interest');
const monthlyPaymentDisplay = document.getElementById('monthly_payment');
const formToggle = document.querySelectorAll('.message a');
const forms = document.querySelectorAll('form');
const naira = '\u20A6';

function loanPayment(amount, months) {
  const i = (0.1 / 12); // interest rate is 10%
  const monthlyPayment = amount * i * Math.pow((1 + i), months) / (Math.pow((1 + i), months) - 1);
  const totalInterest = (monthlyPayment * months) - amount;
  monthlyPaymentDisplay.innerText = naira + monthlyPayment.toFixed(2);
  interestDisplay.innerText = naira + totalInterest.toFixed(2);
}

// MENU TOGGLE
if (menuToggle && navBar) {
  menuToggle.addEventListener('click', () => {
    navBar.classList.toggle('menu');
  });
}

// QUICK ESTIMATE DISPLAY
if (loanAmount && loanTerm && amountDisplay && termDisplay) {
  loanAmount.addEventListener('change', () => {
    amountDisplay.forEach((elem) => {
      elem.innerText = naira + loanAmount.value;
    });
    loanPayment(parseInt(loanAmount.value, 10), parseInt(loanTerm.value, 10));
  });

  loanTerm.addEventListener('change', () => {
    const num = loanTerm.value;
    let month;
    if (num == 1) {
      month = 'month';
    } else {
      month = 'months';
    }
    termDisplay.forEach((elem) => {
      elem.innerText = `${num} ${month}`;
    });
    loanPayment(parseInt(loanAmount.value, 10), parseInt(loanTerm.value, 10));
  });
}

// Login / Register toggle
function switchForm() {
  forms.forEach((form) => {
    form.classList.toggle('closed');
  });
}

if (formToggle) {
  formToggle.forEach((toggle) => {
    toggle.addEventListener('click', switchForm);
  });
}
