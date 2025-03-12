import Joi from 'joi';

export const addWaterSchema = Joi.object({
  volume: Joi.number().min(50).max(5000).required().messages({
    'number.min': 'The volume of water must be at least {#limit} ml',
    'number.max': 'The volume of water should not exceed {#limit} ml',
    'any.required': 'The volume of water is mandatory',
  }),

  date: Joi.date().iso().required().messages({
    'date.format': 'Invalid date format. Use ISO 8601 format.',
  }),
});

export const updateWaterSchema = Joi.object({
  volume: Joi.number().min(50).max(5000).optional().messages({
    'number.min': 'The volume of water must be at least {#limit} ml',
    'number.max': 'The volume of water should not exceed {#limit} ml',
  }),
  date: Joi.date()
    .iso()
    .optional() // дата є опційною, якщо її не надають
    .messages({
      'date.format': 'Invalid date format. Use ISO 8601 format.',
    })
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

// формат YYYY-MM-DD
export const dailyWaterSchema = Joi.object({
  day: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'The date must be in the format "YYYY-MM-DD"',
      'string.empty': 'Date is required',
    }),
});

// формат YYYY-MM
export const monthlyWaterSchema = Joi.object({
  month: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'The date must be in the format "YYYY-MM"',
      'string.empty': 'Date is required',
    }),
});
