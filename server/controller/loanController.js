import { errorRes, successRes } from '../utils/responseHandler';
import { loanPayment } from '../utils/helperUtils';
import LoanModel from '../models/loanModel';

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
}

export default Loans;