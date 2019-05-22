import { Router } from 'express';
import Users from '../controller/userController';
import Validate from '../middleware/validateUserInput';

const authRoutes = Router();

authRoutes.post('/signup', Validate.signup, Users.signup);
authRoutes.post('/login', Validate.login, Users.login);

export default authRoutes;
