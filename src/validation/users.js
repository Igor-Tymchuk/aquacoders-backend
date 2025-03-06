import Joi from 'joi';

export const inputUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

