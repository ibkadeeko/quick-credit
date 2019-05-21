/**
 * @module app
 * @desc Manages the express configuration settings for the application.
 * @requires express
 * @requires express-validator
 * @requires swagger-ui-express
 * @requires yamljs
 * @requires cors
 * @requires /routes
 */
import express from 'express';
import expressValidator from 'express-validator';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import { config } from 'dotenv';
import { errorRes, successRes } from './utils/responseHandler';
import routes from './routes';

config();
const app = express();

const swaggerDoc = YAML.load(`${process.cwd()}/swagger.yaml`);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cors());

app.use('/api/v1', routes);

app.get('/', (req, res) => successRes(res, 200, { message: 'Welcome to Quick Credit API v1' }));

app.all('*', (req, res, next) => errorRes(next, 404, 'The Route you are requesting for does not exist'));


app.use((err, req, res, next) => {
  console.error(err.message);
  res.status((err.status >= 100 && err.status < 600) ? err.status : 500);
  res.send({
    status: err.status ? err.status : 500,
    error: err.message,
  });
});

export default app;
