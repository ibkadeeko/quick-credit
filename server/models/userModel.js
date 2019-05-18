import db from '../db';

/**
 * Contains the functions that help the User Controller Interact with the database
 */
class UserModel {
  /**
   * Searches the database to check if a user exists based on the given email
   * @param {string} email - Users Email
   * @returns {Promise<object | boolean>} Users data or Undefined if not found
   */
  static async find(email) {
    try {
      const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      if (rows) {
        return rows[0];
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  /**
   * Searches the database to check if a user with a given Phone Number exists
   * @param {number} phone - Users Phone Number
   * @returns {Promise<object | boolean>} true or false
   */
  static async findPhone(phone) {
    try {
      const { rows } = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
      if (rows) {
        return rows[0];
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  /**
   * Creates a New User and adds the userObject to the database
   * @param {object} params - Object containing the users details
   * @param {string} params.firstName - Users first Name
   * @param {string} params.lastName - Users Last Name
   * @param {string} params.email - Users email address
   * @param {string} params.password - Users Hashed Password
   * @param {number} params.phone - Users Phone Number
   * @param {string} params.status - Verified or Unverified
   * @param {boolean} params.isAdmin - Is the User an Admin?
   * @returns {Promise<object | boolean>} Newly created Users data
   */
  static async create(params) {
    try {
      const {
        firstName, lastName, email, password, phone, status, isAdmin,
      } = params;
      const newUser = [
        firstName,
        lastName,
        email,
        password,
        phone,
        status,
        isAdmin,
      ];
      const queryText = 'INSERT INTO users (firstname, lastname, email, password, phone, status, isAdmin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const { rows } = await db.query(queryText, newUser);
      if (rows) {
        return rows[0];
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  /**
   * Verifies a user
   * @param {string} email - Users Email
   * @returns {Promise<object>} Verified Users data
   */
  static async verify(email) {
    try {
      const value = 'verified';
      const queryText = 'UPDATE users SET status = $1 WHERE email = $2 RETURNING *';
      const { rows } = await db.query(queryText, [value, email]);
      if (rows) {
        return rows[0];
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  /**
   * Change a users Password
   * @param {string} email - Users Email
   * @param {string} password - Users new Password
   * @returns {Promise<object>} Users data
   */
  static async changePassword(email, password) {
    try {
      const queryText = 'UPDATE users SET password = $1 WHERE email = $2 RETURNING *';
      const { rows } = await db.query(queryText, [password, email]);
      if (rows) {
        return rows[0];
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}

export default UserModel;
