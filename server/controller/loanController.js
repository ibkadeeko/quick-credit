import { errorRes, successRes } from '../utils/responseHandler';
import { loanPayment } from '../utils/helperUtils';
import LoanModel from '../models/loanModel';
import RepaymentModel from '../models/repaymentModel';

const userResSpec = ['id',
  'firstName',
  'lastName',
  'email',
  'amount',
  'tenor',
  'status',
  'paymentInstallment',
  'balance',
  'interest',
  'createdOn'];

class Loans {
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
    // Retrieve or Loan objects created by the user from db if any
    const userLoanArray = LoanModel.find(email);
    let noOngoingLoans;
    if (userLoanArray.length > 0) {
      // Remove all rejected loans if any
      const filteredLoan = userLoanArray
        .filter(loan => loan.status === 'approved' || loan.status === 'pending');
      // Check that all approved loans have been fully paid
      noOngoingLoans = filteredLoan.every(loan => (loan.status !== 'pending'
      && (loan.status === 'approved' && loan.repaid !== false)));
    }
    if (!userLoanArray.length || noOngoingLoans) {
      const newLoan = LoanModel.create(loanApplication);
      const resObj = userResSpec.reduce((result, key) => ({ ...result, [key]: newLoan[key] }), {});
      return successRes(res, 201, resObj);
    }
    return errorRes(next, 400, 'User with this email has an Ongoing Loan');
  }

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

  static getOne(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const loan = LoanModel.findById(id);
    if (loan) { return successRes(res, 200, loan); }
    return errorRes(next, 404, 'Loan with this id was not found');
  }

  static LoanApproval(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    const loanApplication = LoanModel.findById(id);
    if (loanApplication) {
      if (loanApplication.status !== 'pending') {
        return errorRes(next, 400, 'Loan Approval Decision has already been made for this application');
      }
      const applicationRes = LoanModel.handleApproval(id, status);
      return successRes(res, 200, applicationRes);
    }
    return errorRes(next, 404, 'Loan with this id was not found');
  }

  // Loan Repayments

  static postLoanRepayment(req, res, next) {
    const loanId = parseInt(req.params.id, 10);
    const paidAmount = parseFloat(req.body.amount, 10);
    const loanObject = LoanModel.findById(loanId);
    if (loanObject) {
      if (loanObject.status !== 'approved') {
        return errorRes(next, 400, 'Cannot make Payment for Unapproved Loan');
      }
      if (loanObject.repaid === true) {
        return errorRes(next, 400, `Loan with ID: ${loanId} has been fully repaid`);
      }
      const {
        amount, paymentInstallment: monthlyInstallment, repaid, balance,
      } = LoanModel.updateBalance(loanId, paidAmount);
      const { id, createdOn } = RepaymentModel.create(loanId, paidAmount);
      const resObj = {
        id, loanId, createdOn, amount, repaid, monthlyInstallment, paidAmount, balance,
      };
      return successRes(res, 200, resObj);
    }
    return errorRes(next, 404, 'Loan with this id was not found');
  }
}

export default Loans;
