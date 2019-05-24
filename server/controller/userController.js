import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import generator from 'generate-password';
import { errorRes, successRes } from '../utils/responseHandler';
import resetPasswordEmail from '../utils/email';
import UserModel from '../models/userModel';

const keys = ['id', 'firstname', 'lastname', 'email', 'phone', 'address', 'status', 'registered'];

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
  static async signup(req, res, next) {
    const {
      firstName, lastName, email, password, phone, address,
    } = req.body;
    const emailAlreadyExists = await UserModel.find(email);
    if (emailAlreadyExists) return errorRes(next, 409, 'User with this email already exists');
    const phoneAlreadyExists = await UserModel.findPhone(phone);
    if (phoneAlreadyExists) return errorRes(next, 409, 'User with this Phone Number already exists');
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      status: 'unverified',
      isAdmin: false,
    };
    const userObject = await UserModel.create(newUser);
    if (!userObject) { return errorRes(next, 500, 'Internal Server Error'); }
    const payload = {
      userId: userObject.id,
      email: userObject.email,
      isAdmin: userObject.isadmin,
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
  static async login(req, res, next) {
    const { email, password } = req.body;
    const user = await UserModel.find(email);
    if (!user) { return errorRes(next, 404, 'User with this email was not found'); }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) { return errorRes(next, 401, 'email and password do not match'); }
    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isadmin,
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
  static async verify(req, res, next) {
    const { email } = req.params;
    const foundUser = await UserModel.find(email);
    if (!foundUser) { return errorRes(next, 404, 'User with this email was not found'); }
    if (foundUser.status === 'verified') { return errorRes(next, 400, 'User has already been verified'); }
    const user = await UserModel.verify(email);
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
    const { email } = req.params;
    const foundUser = await UserModel.find(email);
    if (!foundUser) { return errorRes(next, 404, 'User with this email was not found'); }
    if (Object.keys(req.body).length === 0) {
      const password = generator.generate({
        length: 10,
        strict: true,
      });
      const hashedPassword = bcrypt.hashSync(password, 8);
      const sent = await resetPasswordEmail(email, password);
      if (!sent) return errorRes(next, 500, 'Unable to send Email');
      const update = await UserModel.changePassword(email, hashedPassword);
      return successRes(res, 200, { message: 'Reset Password Email Successfully Sent' });
    }
    const { password, new_password } = req.body;
    if (password && new_password) {
      const passwordIsValid = bcrypt.compareSync(password, foundUser.password);
      if (!passwordIsValid) { return errorRes(next, 401, 'Incorrect Password'); }
      const hashedPassword = bcrypt.hashSync(new_password, 8);
      const update = await UserModel.changePassword(email, hashedPassword);
      return successRes(res, 200, { message: 'Password Successfully Changed', update });
    }
    return errorRes(next, 400, 'Invalid Request');
  }
}

export default Users;
