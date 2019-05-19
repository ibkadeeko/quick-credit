import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { errorRes } from '../utils/responseHandler';

dotenv.config();

/**
 * Class that contains the Token Verification methods
 */
class Verify {
  /**
   * Verify token to check if user is Authenticated
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next
   */
  static userAccess(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!token) return errorRes(next, 403, 'No token Provided');
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      const { userId, email } = jwt.verify(token, process.env.SECRETkey);
      res.locals.userId = userId;
      res.locals.email = email;
      next();
    } catch (error) {
      return errorRes(next, 500, error.message);
    }
  }

  /**
   * Verify token to check if user has Admin Access
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {function} next
   */
  static adminAccess(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!token) return errorRes(next, 403, 'No token Provided');
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    try {
      const { userId, email, isAdmin } = jwt.verify(token, process.env.SECRETkey);
      if (!isAdmin) return errorRes(next, 403, 'You do not have authorization to access this route');
      res.locals.userId = userId;
      res.locals.email = email;
      next();
    } catch (error) {
      return errorRes(next, 500, error.message);
    }
  }
}

export default Verify;
