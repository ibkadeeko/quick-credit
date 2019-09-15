import { errorRes, successRes } from '../utils/responseHandler';
import loanPayment from '../utils/helperUtils';
import LoanModel from '../models/loanModel';
import RepaymentModel from '../models/repaymentModel';

const userResSpec = [
  'id',
  'firstname',
  'lastname',
  'email',
  'amount',
  'tenor',
  'status',
  'paymentinstallment',
  'balance',
  'interest',
  'createdon',
];

/**
 * Contains all the /loan route endpoint methods
 */
class Loans {
  /**
   * Creates a new Loan Application
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static async create(req, res, next) {
    const {
      firstName, lastName, email, amount, tenor,
    } = req.body;
    if (res.locals.email !== email) {
      return errorRes(next, 400, 'email does not match users email');
    }
    const amountInt = parseInt(amount, 10);
    const tenorInt = parseInt(tenor, 10);
    const { paymentInstallment, interest, balance } = loanPayment(amountInt, tenorInt);
    const loanApplication = {
      firstName,
      lastName,
      email,
      amount: amountInt,
      tenor: tenorInt,
      status: 'pending',
      repaid: false,
      paymentInstallment,
      balance,
      interest,
    };
    const userLoanArray = await LoanModel.find(email);
    /**
     * Check to ensure that user does not have any ongoing Loans or pending application
     */
    let noOngoingLoans;
    if (userLoanArray.length > 0) {
      const filteredLoan = userLoanArray.filter(
        loan => loan.status === 'approved' || loan.status === 'pending',
      );
      noOngoingLoans = filteredLoan.every(
        loan => loan.status !== 'pending' && (loan.status === 'approved' && loan.repaid !== false),
      );
    }
    if (!userLoanArray.length || noOngoingLoans) {
      const newLoan = await LoanModel.create(loanApplication);
      if (!newLoan) return errorRes(next, 500, 'Internal Server Error');
      const resObj = userResSpec.reduce((result, key) => ({ ...result, [key]: newLoan[key] }), {});
      return successRes(res, 201, resObj);
    }
    return errorRes(next, 409, 'User with this email has an Ongoing Loan');
  }

  /**
   * Returns an array of all Loans
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static async getAll(req, res, next) {
    if (Object.keys(req.query).length === 0) {
      const allLoans = await LoanModel.getAllLoans();
      return successRes(res, 200, allLoans);
    }
    const { status } = req.query;
    let { repaid } = req.query;
    if (status && repaid) {
      repaid = JSON.parse(repaid);
      const approvedLoans = await LoanModel.getApprovedLoans(repaid);
      return successRes(res, 200, approvedLoans);
    }
    return errorRes(next, 400, 'Invalid Request');
  }

  /**
   * Returns the data of a single Loan
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static async getOne(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(res.locals.userId, 10);
    const loan = await LoanModel.findById(id);
    if (!loan) {
      return errorRes(next, 404, 'Loan with this id was not found');
    }
    const loanUserId = await LoanModel.getUserIdFromLoanId(id);
    if (!res.locals.isAdmin) {
      if (loanUserId !== userId) return errorRes(next, 401, 'You cannot view another users Loan');
    }
    return successRes(res, 200, loan);
  }

  /**
   * Method to approve or reject a loan application
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static async LoanApproval(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const loanApplication = await LoanModel.findById(id);
    if (!loanApplication) {
      return errorRes(next, 404, 'Loan with this id was not found');
    }
    if (loanApplication.status !== 'pending') {
      return errorRes(
        next,
        400,
        'Loan Approval Decision has already been made for this application',
      );
    }
    const verificationStatus = await LoanModel.userVerificationStatus(id);
    if (status === 'approved' && verificationStatus === 'unverified') {
      return errorRes(next, 400, 'Cannot approve loan of unverified user');
    }
    const applicationRes = await LoanModel.handleApproval(id, status);
    return successRes(res, 200, applicationRes);
  }

  /**
   * Method to create a loan Repayment Entry. Post Loan repayment
   * in favor of user and update Loan balance
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static async postLoanRepayment(req, res, next) {
    const loanId = parseInt(req.params.id, 10);
    const paidAmount = parseFloat(req.body.amount);
    const loanObject = await LoanModel.findById(loanId);
    if (!loanObject) {
      return errorRes(next, 404, 'Loan with this id was not found');
    }
    if (loanObject.status !== 'approved') {
      return errorRes(next, 400, 'Cannot make Payment for Unapproved Loan');
    }
    if (loanObject.repaid === true) {
      return errorRes(next, 400, `Loan with ID: ${loanId} has been fully repaid`);
    }
    const currentBalance = Math.ceil(loanObject.balance);
    if (paidAmount > currentBalance) {
      return errorRes(
        next,
        400,
        `Paid Amount Exceeds Balance. Your current balance is ${currentBalance}`,
      );
    }
    const {
      amount,
      paymentInstallment: monthlyInstallment,
      repaid,
      balance,
    } = await LoanModel.updateBalance(loanId, paidAmount);
    const { id, createdOn } = await RepaymentModel.create(loanId, paidAmount);
    const resObj = {
      id,
      loanId,
      createdOn,
      amount,
      repaid,
      monthlyInstallment,
      paidAmount,
      balance,
    };
    return successRes(res, 200, resObj);
  }

  /**
   * Returns All Loan Repayments for a specific loan
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static async getLoanRepayment(req, res, next) {
    const loanId = parseInt(req.params.id, 10);
    const loanRepaymentsArray = await RepaymentModel.findByLoanId(loanId);
    if (!loanRepaymentsArray.length) {
      return errorRes(next, 404, `Repayments for Loan with ID: ${loanId} not found`);
    }
    const userId = parseInt(res.locals.userId, 10);
    const loanUserId = await LoanModel.getUserIdFromLoanId(loanId);
    if (!res.locals.isAdmin) {
      if (loanUserId !== userId) return errorRes(next, 401, 'You cannot view another users repayment history');
    }
    return successRes(res, 200, loanRepaymentsArray);
  }

  /**
   * Returns the data of all loans owned by a single user
   * @param {object} req - request
   * @param {object} res - response
   */
  static async getUserLoans(req, res) {
    const { email } = res.locals;
    const userLoanArray = await LoanModel.find(email);
    if (!userLoanArray.length) {
      return successRes(res, 200, userLoanArray);
    }
    if (userLoanArray.length > 0) {
      const approvedLoans = userLoanArray.filter(loan => loan.status === 'approved');
      const returnData = approvedLoans || [];
      return successRes(res, 200, returnData);
    }
    return successRes(res, 200, userLoanArray);
  }
}

export default Loans;
