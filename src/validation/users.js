import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(12),
  email: Joi.string().email(),
  gender: Joi.string().valid('male', 'female', 'none'),
  weight: Joi.number().min(0).max(250),
  dailySportTime: Joi.number().min(0).max(24).precision(1).messages({
    'number.base': 'dailySportTime must be a number',
    'number.min': 'dailySportTime cannot be less than 0',
    'number.max': 'dailySportTime cannot be greater than 24',
    'number.precision': 'dailySportTime must have no more than 1 decimal place',
  }),
  dailyNorm: Joi.number().min(500).max(15000),
})
  .or('name', 'email', 'gender', 'weight', 'dailySportTime', 'dailyNorm')
  .messages({
    'object.missing': 'At least one field to update must be specified',
  });

export const updateUserAvatarSchema = Joi.object({
  avatarUrl: Joi.string().uri().required(),
});
export const inputUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(50).required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(5).max(50).required(),
  token: Joi.string().required(),
});
