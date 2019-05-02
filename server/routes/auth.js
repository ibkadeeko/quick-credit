import { Router } from 'express';
import Users from '../controller/userController';
import Validate from '../middleware/validateUserInput';

const authRoutes = Router();

authRoutes.post('/signup', Validate.signup, Users.signup);
authRoutes.post('/login', Validate.login, Users.login);
authRoutes.post('/reset', Validate.reset, Users.resetPassword);
authRoutes.post('/resetpassword', Validate.changePassword, Users.changePassword);

export default authRoutes;
