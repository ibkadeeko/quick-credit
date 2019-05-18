/**
 * It Uses the Personal loan amortization Method to calculate the interest on a loan
 * based on its tenor and rate. Returns the monthly Payment Installments, interest and balance
 * @param {number} amount - Amount user wants to loan
 * @param {number} months - Number of months user wants to loan the money for
 * @returns {{ paymentInstallment: number, interest: number, balance: number }}
 * Monthly Repayment Amount, Loan Interest, Balance
 */
const loanPayment = (amount, months) => {
  const i = (0.1 / 12); // interest rate is 10%
  const monthlyPayment = amount * i * ((1 + i) ** months) / (((1 + i) ** months) - 1);
  const totalInterest = (monthlyPayment * months) - amount;
  const totalPayable = totalInterest + amount;
  const paymentInstallment = parseFloat(monthlyPayment.toFixed(2));
  const interest = parseFloat(totalInterest.toFixed(2));
  const balance = parseFloat(totalPayable.toFixed(2));
  return {
    paymentInstallment,
    interest,
    balance,
  };
};

export default loanPayment;
