import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { errorRes, successRes } from '../utils/responseHandler';
import resetPassword from '../utils/email';
import UserModel from '../models/userModel';

dotenv.config();

const keys = ['id', 'firstName', 'lastName', 'email', 'phone', 'status', 'registered'];
class Users {
  static signup(req, res, next) {
    const {
      firstName, lastName, email, password, phone,
    } = req.body;
    if (UserModel.find(email)) return errorRes(next, 400, 'User with this email already exists');
    if (UserModel.findPhone(phone)) return errorRes(next, 400, 'User with this Phone Number already exists');
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
    // JWT for token
    const userObject = UserModel.create(newUser);
    // Remember to use an if else statement for the remaining logic when using db
    const payload = {
      userId: userObject.id,
      email: userObject.email,
      isAdmin: userObject.isAdmin,
    };
    // create a token
    const token = jwt.sign(payload, process.env.SECRETkey, { expiresIn: 21600 });
    // hide password and admin status from response
    const user = keys.reduce((result, key) => ({ ...result, [key]: userObject[key] }), {});
    // delete userObject.password;
    return successRes(res, 201, { token, user });
  }

  static login(req, res, next) {
    const { email, password } = req.body;
    const user = UserModel.find(email);
    if (user) {
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) return errorRes(next, 401, 'email and password do not match');
      const payload = {
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      const token = jwt.sign(payload, process.env.SECRETkey, { expiresIn: 21600 });
      const userObject = keys.reduce((result, key) => ({ ...result, [key]: user[key] }), {});
      return successRes(res, 200, { token, user: userObject });
    }
    return errorRes(next, 400, 'User with this email was not found');
  }

  static verify(req, res, next) {
    const { email } = req.params;
    const foundUser = UserModel.find(email);
    if (foundUser) {
      const user = UserModel.verify(email);
      const userObject = keys.reduce((result, key) => ({ ...result, [key]: user[key] }), {});
      return successRes(res, 200, userObject);
    }
    return errorRes(next, 404, 'User with this email was not found');
  }

  static async resetPassword(req, res, next) {
    const { email } = req.body;
    const foundUser = UserModel.find(email);
    if (foundUser) {
      const token = jwt.sign({ email }, process.env.SECRETkey, { expiresIn: '3h' });
      const sent = await resetPassword(email, token);
      if (!sent) return errorRes(next, 500, 'Unable to send Email');
      return successRes(res, 200, { message: 'Reset Password Email Successfully Sent' });
    }
    return errorRes(next, 404, 'User with this email was not found');
  }

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
