import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { errorRes, successRes } from '../utils/responseHandler';
import UserModel from '../models/userModel';

dotenv.config();

class Users {
  static async signup(req, res, next) {
    const {
      firstName, lastName, email, password, phone,
    } = req.body;
    if (UserModel.find(email)) return errorRes(next, 400, 'User with this email already exists');
    if (UserModel.findPhone(phone)) return errorRes(next, 400, 'User with this Phone Number already exists');
    const hashedPassword = await bcrypt.hashSync(password, 8);
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
    // to hide password from response
    delete userObject.password;
    return successRes(res, 201, { token, user: userObject });
  }
}

export default Users;
