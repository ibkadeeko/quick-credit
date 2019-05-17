import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { errorRes, successRes } from '../utils/responseHandler';
import resetPasswordEmail from '../utils/email';
import UserModel from '../models/userModel';

const keys = ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'registered'];

/**
 * Contains all the user route methods
 */
class Users {
  /**
   * Register a new user
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static signup(req, res, next) {
    const {
      firstName, lastName, email, password, phone,
    } = req.body;
    if (UserModel.find(email)) return errorRes(next, 409, 'User with this email already exists');
    if (UserModel.findPhone(phone)) return errorRes(next, 409, 'User with this Phone Number already exists');
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      status: 'unverified',
      isAdmin: false,
    };
    const userObject = UserModel.create(newUser);
    const payload = {
      userId: userObject.id,
      email: userObject.email,
      isAdmin: userObject.isAdmin,
    };
    const token = jwt.sign(payload, process.env.SECRETkey, { expiresIn: 21600 });
    const user = keys.reduce((result, key) => ({ ...result, [key]: userObject[key] }), {});
    return successRes(res, 201, { token, user, message: 'User successfully created' });
  }

  /**
   * Log in a user
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static login(req, res, next) {
    const { email, password } = req.body;
    const user = UserModel.find(email);
    if (!user) { return errorRes(next, 404, 'User with this email was not found'); }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) { return errorRes(next, 401, 'email and password do not match'); }
    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const token = jwt.sign(payload, process.env.SECRETkey, { expiresIn: 21600 });
    const userObject = keys.reduce((result, key) => ({ ...result, [key]: user[key] }), {});
    return successRes(res, 200, { token, user: userObject, message: 'User logIn successful' });
  }

  /**
   * Verify a User after confirming Home/Work Address
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static verify(req, res, next) {
    const { email } = req.params;
    const foundUser = UserModel.find(email);
    if (!foundUser) { return errorRes(next, 404, 'User with this email was not found'); }
    const user = UserModel.verify(email);
    const userObject = keys.reduce((result, key) => ({ ...result, [key]: user[key] }), {});
    return successRes(res, 200, userObject);
  }

  /**
   * Send an email to a user to reset password
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static async resetPassword(req, res, next) {
    const { email } = req.body;
    const foundUser = UserModel.find(email);
    if (!foundUser) { return errorRes(next, 404, 'User with this email was not found'); }
    const token = jwt.sign({ email }, process.env.SECRETkey, { expiresIn: '3h' });
    const sent = await resetPasswordEmail(email, token);
    if (!sent) return errorRes(next, 500, 'Unable to send Email');
    return successRes(res, 200, { message: 'Reset Password Email Successfully Sent' });
  }

  /**
   * Change a users password
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static changePassword(req, res, next) {
    const { password } = req.body;
    const { token } = req.query;
    try {
      const { email } = jwt.verify(token, process.env.SECRETkey);
      const foundUser = UserModel.find(email);
      if (!foundUser) return errorRes(next, 404, 'User with this email was not found');
      const hashedPassword = bcrypt.hashSync(password, 8);
      const update = UserModel.changePassword(email, hashedPassword);
      return successRes(res, 200, update);
    } catch (error) {
      next(error);
    }
  }
}

export default Users;
