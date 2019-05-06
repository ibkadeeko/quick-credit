/**
* Generates error and sends to app error handler
* @param {number} code Error Status Code
* @param {string} message Specific error message
*/
export const errorRes = (next, code, message) => {
  const error = new Error(message);
  error.status = code;
  return next(error);
};

/**
 * Returns response to the user
 * @param {number} code Response Status Code
 * @param {object | string} data Specific response message
 */
export const successRes = (res, code, data) => res
  .status(code)
  .send({
    status: code,
    data,
  });
