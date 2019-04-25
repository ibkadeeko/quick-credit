import express from 'express';
import authRoutes from './auth';
import loanRoutes from './loans';

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/loans', loanRoutes);

export default routes;
