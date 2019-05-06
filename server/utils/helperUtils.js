/**
 * Adds zero(0) to the front of a single digit e.g pad(1) = 01
 * @param {number} n number to be padded
 * @returns {string | number} padded number for a single digit or
 * the same number if its not a single digit
 */
const pad = n => (n < 10 ? `0${n}` : n);

/**
* Gets the current date and changes it to a dd/mm/yyyy format
* @returns {string} The formatted date e.g 20/03/2020
*/
export const getDate = () => {
  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const ddmmyyyy = `${pad(date)}/${pad(month + 1)}/${year}`;
  return ddmmyyyy;
};

/**
 * It Uses the Personal loan amortization Method to calculate the interest on a loan
 * based on its tenor and rate. Returns the monthly Payment Installments, interest and balance
 * @param {number} amount - Amount user wants to loan
 * @param {number} months - Number of months user wants to loan the money for
 * @returns {{ paymentInstallment: number, interest: number, balance: number }}
 * Monthly Repayment Amount, Loan Interest, Balance
 */
export const loanPayment = (amount, months) => {
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
