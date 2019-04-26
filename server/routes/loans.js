import { Router } from 'express';
import Loans from '../controller/loanController';
import Validate from '../middleware/validateLoanInput';

const loanRoutes = Router();

loanRoutes.post('/', Validate.loanApplication, Loans.create);
loanRoutes.get('/', Validate.getRequest, Loans.getAll);
loanRoutes.get('/:id', Validate.id, Loans.getOne);

export default loanRoutes;
