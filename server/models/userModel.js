import usersDb from '../db/users.json';
import { getDate } from '../utils/helperUtils';

/**
 * Contains the functions that help the User Controller Interact with the database
 */
class UserModel {
  /**
   * Searches the database to check if a user exists based on the given email
   * @param {string} email - Users Email
   * @returns {object | undefined} Users data or Undefined if not found
   */
  static find(email) {
    const exists = usersDb.find(user => user.email === email);
    return exists;
  }

  /**
   * Searches the database to check if a user with a given Phone Number exists
   * @param {number} phone - Users Phone Number
   * @returns {boolean} true or false
   */
  static findPhone(phone) {
    const exists = usersDb.find(user => user.phone === phone);
    return !!exists;
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
   * @returns {object} Newly created Users data
   */
  static create(params) {
    const {
      firstName, lastName, email, password, phone, status, isAdmin,
    } = params;
    const date = getDate();
    const newUser = {
      id: usersDb.length + 1,
      firstName,
      lastName,
      email,
      password,
      phone,
      status,
      isAdmin,
      registered: date,
    };
    usersDb.push(newUser);
    return usersDb[usersDb.length - 1];
  }

  /**
   * Verifies a user
   * @param {string} email - Users Email
   * @returns {object} Verified Users data
   */
  static verify(email) {
    const index = usersDb.findIndex(user => user.email === email);
    usersDb[index].status = 'verified';
    return usersDb[index];
  }

  /**
   * Change a users Password
   * @param {string} email - Users Email
   * @param {string} password - Users new Password
   * @returns {object} Users data
   */
  static changePassword(email, password) {
    const index = usersDb.findIndex(user => user.email === email);
    usersDb[index].password = password;
    return usersDb[index];
  }
}

export default UserModel;
