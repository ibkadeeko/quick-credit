import { Router } from 'express';
import Users from '../controller/userController';
import Validate from '../middleware/validateUserInput';
import Verify from '../middleware/verifyToken';

const userRoutes = Router();

userRoutes.patch('/:email/verify', Validate.verify, Verify.adminAccess, Users.verify);
userRoutes.post('/:email/reset_password', Validate.reset, Users.resetPassword);

export default userRoutes;
