import Joi from 'joi';

export const addWaterSchema = Joi.object({
  volume: Joi.number().min(1).max(5000).required().messages({
    'number.min': 'The volume of water must be at least {#limit} ml',
    'number.max': 'The volume of water should not exceed {#limit} ml',
    'any.required': 'The volume of water is mandatory',
  }),
  userId: Joi.string().optional(),
  date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.isoDate': 'Invalid time format. Use YYYY-MM-DDTHH:mm',
      'any.required': 'The date is mandatory',
    }),
});

export const updateWaterSchema = Joi.object({
  volume: Joi.number().min(1).max(5000).optional().messages({
    'number.min': 'The volume of water must be at least {#limit} ml',
    'number.max': 'The volume of water should not exceed {#limit} ml',
  }),
  //   userId: Joi.string().optional(),
  date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.isoDate': 'Invalid time format. Use YYYY-MM-DDTHH:mm',
      'any.required': 'The date is mandatory',
    }),
})
  .or('volume', 'date')
  .messages({
    'object.missing': 'At least one field to update must be specified',
  });
