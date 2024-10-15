import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  const { body } = req;
  try {
    await schema.validateAsync(body, { abortEarly: false, convert: true });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad request', {
      validationErrors: err.details,
    });
    next(error);
  }
};
