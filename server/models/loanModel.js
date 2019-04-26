import loanDb from '../db/loans.json';
import { getDate } from '../utils/helperUtils';

class LoanModel {
  static find(email) {
    const userLoans = loanDb.filter(loan => loan.email === email);
    return userLoans;
  }

  static create(params) {
    const {
      firstName, lastName, email, amount, tenor, status,
      repaid, paymentInstallment, balance, interest,
    } = params;
    const date = getDate();
    const newLoan = {
      id: loanDb.length + 1,
      firstName,
      lastName,
      email,
      amount,
      tenor,
      status,
      repaid,
      paymentInstallment,
      balance,
      interest,
      createdOn: date,
    };
    loanDb.push(newLoan);
    return loanDb[loanDb.length - 1];
  }

  static getAllLoans() {
    return loanDb;
  }
}

export default LoanModel;
