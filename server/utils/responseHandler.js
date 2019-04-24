export const errorRes = (next, code, message) => {
  const error = new Error(message);
  error.status = code;
  return next(error);
};

export const successRes = (res, code, data) => res
  .status(code)
  .send({
    status: code,
    data,
  });
