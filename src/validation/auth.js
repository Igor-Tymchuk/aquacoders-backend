import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(16),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});