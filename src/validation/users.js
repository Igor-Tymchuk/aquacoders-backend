import Joi from 'joi';

export const signupUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signinUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});