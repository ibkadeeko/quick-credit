import db from '../db';

/**
 * Contains the Methods that help the Repayment Controller interact with the database
 */
class RepaymentModel {
  /**
   * Create a loan repayment entry in the database
   * @param {number} loanId - loan ID
   * @param {number} amount - Repayment amount
   * @returns {Promise<object>} Repayment Object data
   */
  static async create(loanId, amount) {
    const queryText = 'INSERT INTO repayments (loanid, amount) VALUES ($1, $2) RETURNING *';
    const { rows } = await db.query(queryText, [loanId, amount]);
    return rows[0];
  }

  /**
   * Returns the Loan repayment history for a specific loan using its ID
   * @param {number} loanId - loan ID
   */
  static async findByLoanId(loanId) {
    const queryText = 'SELECT * FROM repayments WHERE loanid = $1';
    const { rows } = await db.query(queryText, [loanId]);
    return rows;
  }
}

export default RepaymentModel;
