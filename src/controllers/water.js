import {
  addWater,
  updateWater,
  deleteWater,
  getDailyWater,
  getMonthlyWater,
} from '../services/water.js';

import Joi from 'joi';

// юзер додає запис про воду
export const addWaterController = async (req, res, next) => {
  const { volume, date } = req.body;

  const userId = req.user._id;

  const newWater = await addWater(userId, volume, date);

  res.status(201).json({
    status: 201,
    message: 'Successfully added water record!',
    data: newWater,
  });
};

// юзєр редагує запис про воду
export const updateWaterController = async (req, res, next) => {
  const { id } = req.params;
  const { volume, date } = req.body;

  const userId = req.user._id;

  const updatedWater = await updateWater(userId, id, volume, date);

  res.json({
    status: 200,
    message: 'Successfully updated water record!',
    data: updatedWater,
  });
};

// юзер видаляє запис про воду
export const deleteWaterController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  await deleteWater(userId, id);

  res.status(204).send();
};

const yearMonthDaySchema = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .required()
  .messages({
    'string.pattern.base': 'The date must be in the format "YYYY-MM-DD"',
    'string.empty': 'Date is required',
  });

// отримує дані споживання за конкретний день
export const getDailyWaterController = async (req, res, next) => {
  const userId = req.user._id;
  const { day } = req.query;

  // Перевірка формату за допомогою Joi
  const { error } = yearMonthDaySchema.validate(day);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }

  const waterEntries = await getDailyWater(userId, day);

  res.json({
    status: 200,
    message: 'Successfully retrieved daily water records!',
    data: waterEntries,
  });
};

const yearMonthSchema = Joi.string()
  .pattern(/^\d{4}-\d{2}$/)
  .required()
  .messages({
    'string.pattern.base': 'The date must be in the format "YYYY-MM"',
    'string.empty': 'Date is required',
  });

// отримує дані споживання за конкретний місяць
export const getMonthlyWaterController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // Очікую формат "2025-03"

    // Перевірка формату за допомогою Joi
    const { error } = yearMonthSchema.validate(month);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }

    const waterEntries = await getMonthlyWater(userId, month);

    res.json({
      status: 200,
      message: 'Successfully retrieved monthly water records!',
      data: waterEntries,
    });
  } catch (error) {
    next(error);
  }
};
