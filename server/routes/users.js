import { Router } from 'express';
import Users from '../controller/userController';
import Validate from '../middleware/validateUserInput';

const userRoutes = Router();

userRoutes.patch('/:email/verify', Validate.verify, Users.verify);

export default userRoutes;
