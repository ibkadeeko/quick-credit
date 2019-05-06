import loanDb from '../db/loans.json';
import { getDate } from '../utils/helperUtils';

/**
 * Contains the methods that help the Loan Controller interact with the database
 */
class LoanModel {
  /**
   * Returns an array of loans owned by a specific user
   * @param {string} email - Users email
   * @returns {[object]} Array of Loan Objects
   */
  static find(email) {
    const userLoans = loanDb.filter(loan => loan.email === email);
    return userLoans;
  }

  /**
   * Returns a specific Loan based on its unique ID
   * @param {number} id - Loan ID
   * @returns {object} Single Loan Objects data
   */
  static findById(id) {
    const userLoans = loanDb.find(loan => loan.id === id);
    return userLoans;
  }

  /**
   * Creates a new Loan Application
   * @param {object} params - Object Containing the Loan Details
   * @param {string} params.firstName - Users First Name
   * @param {string} params.lastName - Users last Name
   * @param {string} params.email - Users email address
   * @param {number} params.amount - Amount user wants to loan
   * @param {number} params.tenor - Duration in moths for which user wants to loan money
   * @param {string} params.status - Loan Status defaults to pending
   * @param {boolean} params.repaid - Has the loan been fully repaid?
   * @param {number} params.paymentInstallment - Monthly Repayment Installments
   * @param {number} params.balance - Amount currently owed by the user
   * @param {number} params.interest - Total interest on loan
   * @returns {object} Newly Created Loan Application
   */
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

  /** Returns an array of all loans from the database */
  static getAllLoans() {
    return loanDb;
  }

  /**
   * Returns an array of All Repaid or Unrepaid Loans
   * @param {boolean} repaid - True or False
   */
  static getApprovedLoans(repaid) {
    const approvedLoans = loanDb.filter(loan => loan.status === 'approved' && loan.repaid === repaid);
    return approvedLoans;
  }

  /**
   * Approve or Reject a Clients Loan Application
   * @param {number} id - Loan ID
   * @param {string} status - approved or rejected
   */
  static handleApproval(id, status) {
    const index = loanDb.findIndex(loan => loan.id === id);
    loanDb[index].status = status;
    return loanDb[index];
  }

  /**
   * Update the balance of a loan once a repayment has been made
   * @param {number} id - Loan ID
   * @param {number} amount - Amount that has been repaid
   */
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
