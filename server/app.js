import express from 'express';
import expressValidator from 'express-validator';
import { errorRes, successRes } from './utils/responseHandler';
import routes from './routes';

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());

// Connect all routes to the application
app.use('/api/v1', routes);

// Root Route
app.get('/', (req, res) => successRes(res, 200, { message: 'Welcome to Quick Credit API v1' }));

// Invalid Routes
app.all('*', (req, res, next) => errorRes(next, 404, 'The Route you are requesting for does not exist'));

// Error Message Handler
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.status >= 100 && err.status < 600) { res.status(err.status); } else { res.status(500); }
  res.send({
    status: err.status ? err.status : 500,
    error: err.message,
  });
});

export default app;
