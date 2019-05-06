/**
 * @file Serves the application
 * @requires ./app
 */
import app from './app';

const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
