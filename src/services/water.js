import { WaterCollection } from '../db/models/water.js';
import createError from 'http-errors';

export const addWater = async (userId, volume, date) => {
  if (volume < 50 || volume > 5000) {
    throw createError(400, 'The volume of water should be from 50 to 5000 ml');
  }

  // створює юзер запис в базі і база повертає його
  const newWater = await WaterCollection.create({ volume, date, userId });
  return newWater;
};

export const updateWater = async (userId, id, volume, date) => {
  if (volume < 1 || volume > 5000) {
    throw createError(400, 'The volume of water should be from 1 to 5000 ml');
  }

  // редагує, в базі знаходиться id, відправлються нові данні та повертається оновлений запис
  const updatedWater = await WaterCollection.findOneAndUpdate(
    { _id: id, userId },
    { volume, date },
    { new: true },
  );

  if (!updatedWater) {
    throw createError(404, 'No record found');
  }

  return updatedWater;
};

export const deleteWater = async (userId, id) => {
  const deletedWater = await WaterCollection.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!deletedWater) {
    throw createError(404, 'No record found');
  }

  return;
};

export const getDailyWater = async (userId, date) => {
  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  // знаходимо в базі значення за вказаний день
  const waterEntries = await WaterCollection.find({
    userId,
    //   фільтрація по даті
    date: { $gte: start, $lt: end },
    // тут фільтрація за датою в зворотньому напрямку
  }).sort({ date: -1 });

  return waterEntries;
};

export const getMonthlyWater = async (userId, month) => {
  const start = new Date(month);
  start.setDate(1);
  const end = new Date(month);
  end.setMonth(end.getMonth() + 1);
  end.setDate(1);

  const waterEntries = await WaterCollection.find({
    userId,
    date: { $gte: start, $lt: end },
  }).sort({ date: -1 });

  return waterEntries;
};
