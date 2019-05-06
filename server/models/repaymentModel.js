import repaymentDb from '../db/repayments.json';
import { getDate } from '../utils/helperUtils';

/**
 * Contains the Methods that help the Repayment Controller interact with the database
 */
class RepaymentModel {
  /**
   * Create a loan repayment entry in the database
   * @param {number} loanId - loan ID
   * @param {number} amount - Repayment amount
   * @returns {object} Repayment Object data
   */
  static create(loanId, amount) {
    const date = getDate();
    const newLoanRepayment = {
      id: repaymentDb.length + 1,
      loanId,
      amount,
      createdOn: date,
    };
    repaymentDb.push(newLoanRepayment);
    return repaymentDb[repaymentDb.length - 1];
  }

  /**
   * Returns the Loan repayment history for a specific loan using its ID
   * @param {number} loanId - loan ID
   */
  static findByLoanId(loanId) {
    const loanRepayments = repaymentDb.filter(repayment => repayment.loanId === loanId);
    return loanRepayments;
  }
}

export default RepaymentModel;
