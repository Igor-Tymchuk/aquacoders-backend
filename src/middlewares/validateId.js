import mongoose from 'mongoose';
import createError from 'http-errors';

export const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, 'Invalid water record ID'));
  }

  next();
};
