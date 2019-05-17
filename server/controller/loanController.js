import { errorRes, successRes } from '../utils/responseHandler';
import { loanPayment } from '../utils/helperUtils';
import LoanModel from '../models/loanModel';
import RepaymentModel from '../models/repaymentModel';

const userResSpec = [
  'id',
  'firstName',
  'lastName',
  'email',
  'amount',
  'tenor',
  'status',
  'paymentInstallment',
  'balance',
  'interest',
  'createdOn',
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
  static create(req, res, next) {
    const {
      firstName, lastName, email, amount, tenor,
    } = req.body;
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
    const userLoanArray = LoanModel.find(email);
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
      const newLoan = LoanModel.create(loanApplication);
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
  static getAll(req, res, next) {
    if (Object.keys(req.query).length === 0) {
      const allLoans = LoanModel.getAllLoans();
      return successRes(res, 200, allLoans);
    }
    const { status } = req.query;
    let { repaid } = req.query;
    if (status && repaid) {
      repaid = JSON.parse(repaid);
      const approvedLoans = LoanModel.getApprovedLoans(repaid);
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
  static getOne(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const loan = LoanModel.findById(id);
    if (!loan) {
      return errorRes(next, 404, 'Loan with this id was not found');
    }
    return successRes(res, 200, loan);
  }

  /**
   * Method to approve or reject a loan application
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static LoanApproval(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const loanApplication = LoanModel.findById(id);
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
    const applicationRes = LoanModel.handleApproval(id, status);
    return successRes(res, 200, applicationRes);
  }

  /**
   * Method to create a loan Repayment Entry. Post Loan repayment
   * in favor of user and update Loan balance
   * @param {object} req - request
   * @param {object} res - response
   * @param {function} next
   */
  static postLoanRepayment(req, res, next) {
    const loanId = parseInt(req.params.id, 10);
    const paidAmount = parseFloat(req.body.amount);
    const loanObject = LoanModel.findById(loanId);
    if (!loanObject) {
      return errorRes(next, 404, 'Loan with this id was not found');
    }
    if (loanObject.status !== 'approved') {
      return errorRes(next, 400, 'Cannot make Payment for Unapproved Loan');
    }
    if (loanObject.repaid === true) {
      return errorRes(next, 400, `Loan with ID: ${loanId} has been fully repaid`);
    }
    const {
      amount,
      paymentInstallment: monthlyInstallment,
      repaid,
      balance,
    } = LoanModel.updateBalance(loanId, paidAmount);
    const { id, createdOn } = RepaymentModel.create(loanId, paidAmount);
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
  static getLoanRepayment(req, res, next) {
    const loanId = parseInt(req.params.id, 10);
    const loanRepaymentsArray = RepaymentModel.findByLoanId(loanId);
    if (!loanRepaymentsArray.length) {
      return errorRes(next, 404, `Repayments for Loan with ID: ${loanId} not found`);
    }
    return successRes(res, 200, loanRepaymentsArray);
  }
}

export default Loans;
