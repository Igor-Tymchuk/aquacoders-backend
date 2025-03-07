import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  gender: Joi.string().valid('male', 'female', 'none'),
  weight: Joi.number().min(0).max(250),
  dailySportTime: Joi.number().min(0).max(24).precision(1).messages({
    'number.base': 'dailySportTime must be a number',
    'number.min': 'dailySportTime cannot be less than 0',
    'number.max': 'dailySportTime cannot be greater than 24',
    'number.precision': 'dailySportTime must have no more than 1 decimal place',
  }),
  dailyNorm: Joi.number().min(500).max(5000),
  avatarUrl: Joi.string().uri(),
});

export const inputUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
