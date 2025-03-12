import createHttpError from 'http-errors';

export const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query);
  if (error) {
    return next(createHttpError(400, error.details[0].message));
  }
  next();
};
