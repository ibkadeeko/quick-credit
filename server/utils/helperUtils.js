const pad = n => (n < 10 ? `0${n}` : n);

export const getDate = () => {
  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const ddmmyyyy = `${pad(date)}/${pad(month + 1)}/${year}`;

  return ddmmyyyy;
};

// Using the Personal loan amortization Method for fixed monthly repayment
export const loanPayment = (amount, months) => {
  const i = (0.1 / 12); // interest rate is 10%
  const monthlyPayment = amount * i * ((1 + i) ** months) / (((1 + i) ** months) - 1);
  const totalInterest = (monthlyPayment * months) - amount;
  const totalPayable = totalInterest + amount;
  const paymentInstallment = parseFloat(monthlyPayment);
  const interest = parseFloat(totalInterest);
  const balance = parseFloat(totalPayable);
  return {
    paymentInstallment: paymentInstallment.toFixed(2),
    interest: interest.toFixed(2),
    balance: balance.toFixed(2),
  };
};
