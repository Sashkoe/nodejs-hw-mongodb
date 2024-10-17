import { isHttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    const response = {
      status: err.status,
      message: err.message,
    };

    if (err.validationErrors) {
      response.validationErrors = err.validationErrors.map((error) => ({
        message: error.message,
        path: error.path,
      }));
    }

    res.status(err.status).json(response);
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
