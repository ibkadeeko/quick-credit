import loanDb from '../db/loans.json';
import { getDate } from '../utils/helperUtils';

class LoanModel {
  static find(email) {
    const userLoans = loanDb.filter(loan => loan.email === email);
    return userLoans;
  }

  static findById(id) {
    const userLoans = loanDb.find(loan => loan.id === id);
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

  static getApprovedLoans(repaid) {
    const approvedLoans = loanDb.filter(loan => loan.status === 'approved' && loan.repaid === repaid);
    return approvedLoans;
  }

  static handleApproval(id, status) {
    const index = loanDb.findIndex(loan => loan.id === id);
    loanDb[index].status = status;
    return loanDb[index];
  }

  static updateBalance(id, amount) {
    const index = loanDb.findIndex(loan => loan.id === id);
    loanDb[index].balance -= amount;
    if (loanDb[index].balance <= 0) {
      loanDb[index].repaid = true;
    }
    return loanDb[index];
  }
}

export default LoanModel;
