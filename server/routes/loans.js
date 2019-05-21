import { Router } from 'express';
import Loans from '../controller/loanController';
import Validate from '../middleware/validateLoanInput';
import Verify from '../middleware/verifyToken';

const loanRoutes = Router();

loanRoutes.post('/', Validate.loanApplication, Verify.userAccess, Loans.create);
loanRoutes.get('/', Validate.getRequest, Verify.adminAccess, Loans.getAll);
loanRoutes.get('/:id', Validate.id, Verify.userAccess, Loans.getOne);
loanRoutes.patch('/:id', Validate.loanApproval, Verify.adminAccess, Loans.LoanApproval);

// Loan Repayments
loanRoutes.post('/:id/repayment', Validate.repayment, Loans.postLoanRepayment);
loanRoutes.get('/:id/repayments', Validate.id, Loans.getLoanRepayment);

export default loanRoutes;
