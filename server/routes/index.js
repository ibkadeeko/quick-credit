import express from 'express';
import authRoutes from './auth';
import loanRoutes from './loans';
import userRoutes from './users';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/loans', loanRoutes);
routes.use('/users', userRoutes);

export default routes;
