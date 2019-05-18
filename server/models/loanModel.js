import db from '../db';

/**
 * Contains the methods that help the Loan Controller interact with the database
 */
class LoanModel {
  /**
   * Returns an array of loans owned by a specific user
   * @param {string} email - Users email
   * @returns {Promise<object | boolean>} Array of Loan Objects
   */
  static async find(email) {
    try {
      const { rows } = await db.query('SELECT * FROM loans WHERE email = $1', [email]);
      if (rows) {
        return rows;
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  /**
   * Returns a specific Loan based on its unique ID
   * @param {number} id - Loan ID
   * @returns {Promise<object | boolean>} Single Loan Objects data
   */
  static async findById(id) {
    try {
      const { rows } = await db.query('SELECT * FROM loans WHERE id = $1', [id]);
      if (rows) {
        return rows[0];
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
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
   * @returns {Promise<object | boolean>} Newly Created Loan Application
   */
  static async create(params) {
    try {
      const {
        firstName, lastName, email, amount, tenor, status,
        repaid, paymentInstallment, balance, interest,
      } = params;
      const newLoan = [
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
      ];
      const result = await db.query('SELECT MAX(id) FROM loans');
      const { max } = result.rows[0];
      const newID = parseInt(max, 10) + 1;
      let queryText;
      if (max) {
        queryText = `
        INSERT INTO loans (firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest) 
        VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        ON CONFLICT ON CONSTRAINT loans_pkey DO UPDATE 
        SET (id, firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest, createdon) = (${newID}, EXCLUDED.firstname, EXCLUDED.lastname, EXCLUDED.email, EXCLUDED.amount, EXCLUDED.tenor, EXCLUDED.status, EXCLUDED.repaid, EXCLUDED.paymentinstallment, EXCLUDED.balance, EXCLUDED.interest, EXCLUDED.createdon) RETURNING *`;
      } else {
        queryText = 'INSERT INTO loans (firstname, lastname, email, amount, tenor, status, repaid, paymentinstallment, balance, interest) VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
      }
      const { rows } = await db.query(queryText, newLoan);
      if (rows) {
        return rows[0];
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  /** Returns an array of all loans from the database */
  static async getAllLoans() {
    const { rows } = await db.query('SELECT * FROM loans ORDER BY id ASC');
    return rows;
  }

  /**
   * Returns an array of All Repaid or Unrepaid Loans
   * @param {boolean} repaid - True or False
   */
  static async getApprovedLoans(repaid) {
    const queryText = 'SELECT * FROM loans WHERE status = $1 AND repaid = $2';
    const { rows } = await db.query(queryText, ['approved', repaid]);
    return rows;
  }

  /**
   * Approve or Reject a Clients Loan Application
   * @param {number} id - Loan ID
   * @param {string} status - approved or rejected
   */
  static async handleApproval(id, status) {
    const queryText = 'UPDATE loans set status = $1 WHERE id = $2 RETURNING *';
    const { rows } = await db.query(queryText, [status, id]);
    if (rows) {
      return rows[0];
    }
  }

  /**
   * Update the balance of a loan once a repayment has been made
   * @param {number} id - Loan ID
   * @param {number} amount - Amount that has been repaid
   */
  static async updateBalance(id, amount) {
    try {
      const balanceQuery = 'SELECT balance FROM loans WHERE id = $1';
      const updateQuery = 'UPDATE loans SET balance = $1 WHERE id = $2 RETURNING *';
      const repaidQuery = 'UPDATE loans SET repaid = $1 WHERE id = $2';
      const result = await db.query(balanceQuery, [id]);
      const { balance } = result.rows[0];
      const newBalance = balance - amount;
      if (newBalance <= 0) {
        await db.query(repaidQuery, [true, id]);
      }
      const { rows } = await db.query(updateQuery, [newBalance, id]);
      return rows[0];
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}

export default LoanModel;
