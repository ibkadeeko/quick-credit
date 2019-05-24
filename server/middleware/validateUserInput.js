import { errorRes } from '../utils/responseHandler';

class Validate {
  static signup(req, res, next) {
    req.checkBody('firstName')
      .notEmpty()
      .withMessage('First Name is required')
      .trim()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
      .withMessage('First Name Input is Invalid')
      .customSanitizer(name => name.toLowerCase());
    req.checkBody('lastName')
      .notEmpty()
      .withMessage('Last Name is required')
      .trim()
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)
      .withMessage('Last Name Input is Invalid')
      .customSanitizer(name => name.toLowerCase());
    req.checkBody('email')
      .notEmpty()
      .withMessage('Email is required')
      .trim()
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      .withMessage('Input a valid email')
      .customSanitizer(name => name.toLowerCase());
    req.checkBody('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password Should have a minimum length of 6');
    req.checkBody('phone')
      .notEmpty()
      .withMessage('Phone number is required')
      .trim()
      .isNumeric()
      .isInt()
      .withMessage('Input a valid Phone Number')
      .isLength({ min: 8 })
      .withMessage('Minimum length of Phone Number is 8 digits');
    req
      .checkBody('address')
      .notEmpty()
      .withMessage('Address field is required')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Address should be a minimum of 10 characters')
      .matches(/^[a-zA-Z0-9\s,.'-]{3,}$/)
      .withMessage('Invalid Address format entered');
    const errors = req.validationErrors();
    if (errors) {
      return errorRes(next, 400, errors[0].msg);
    }
    next();
  }

  static login(req, res, next) {
    req.checkBody('email')
      .notEmpty()
      .withMessage('Email is required')
      .trim()
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      .withMessage('Input a valid email')
      .customSanitizer(name => name.toLowerCase());
    req.checkBody('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required');
    const errors = req.validationErrors();
    if (errors) {
      return errorRes(next, 400, errors[0].msg);
    }
    next();
  }

  static verify(req, res, next) {
    req.checkParams('email')
      .notEmpty()
      .trim()
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      .withMessage('Input a valid email Parameter')
      .customSanitizer(email => email.toLowerCase());
    const errors = req.validationErrors();
    if (errors) {
      return errorRes(next, 400, errors[0].msg);
    }
    next();
  }

  static reset(req, res, next) {
    req.checkParams('email')
      .notEmpty()
      .withMessage('Email is required')
      .trim()
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      .withMessage('Input a valid email Parameter')
      .customSanitizer(email => email.toLowerCase());
    req.checkBody('password')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Password is required');
    req.checkBody('new_password')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('New Password is required')
      .isLength({ min: 6 })
      .withMessage('Password Should have a minimum length of 6');
    const errors = req.validationErrors();
    if (errors) {
      return errorRes(next, 400, errors[0].msg);
    }
    next();
  }
}

export default Validate;
