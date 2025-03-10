import { WaterCollection } from '../db/models/water.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

export const addWater = async (userId, volume, date) => {
  if (volume < 50 || volume > 5000) {
    throw createError(400, 'The volume of water should be from 50 to 5000 ml');
  }

  const formattedDate = new Date(date); // Перетворюємо в Date

  // створює юзер запис в базі і база повертає його
  const newWater = await WaterCollection.create({
    volume,
    date: formattedDate,
    userId,
  });
  return newWater;
};

export const updateWater = async (userId, id, volume, date) => {
  if (volume < 50 || volume > 5000) {
    throw createError(400, 'The volume of water should be from 50 to 5000 ml');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, 'Invalid water record ID');
  }

  const formattedDate = new Date(date);

  // редагує, в базі знаходиться id, відправлються нові данні та повертається оновлений запис
  const updatedWater = await WaterCollection.findOneAndUpdate(
    { _id: id, userId },
    { volume, date: formattedDate },
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
  start.setHours(0, 0, 0, 0); // Початок дня
  const end = new Date(start);
  end.setDate(end.getDate() + 1); // Кінець дня

  // знаходимо в базі значення за вказаний день
  const waterEntries = await WaterCollection.find({
    userId,
    //   фільтрація по даті
    date: { $gte: start, $lt: end },
    // тут фільтрація за датою в зворотньому напрямку
  })
    .sort({ date: -1 })
    .lean(); //отримуємо прості об'єкти

  return waterEntries.map((entry) => ({
    ...entry,
    date: new Date(entry.date), // Перетворення в Date
  }));
};

export const getMonthlyWater = async (userId, month) => {
  // Параметр місяця який запрашує юзер ("2025-03")
  const [inputYear, inputMonth] = month.split('-').map(Number);

  // Вираховую початок і кінець місяця
  const start = new Date(inputYear, inputMonth - 1, 1, 0, 0, 0, 0);
  const end = new Date(inputYear, inputMonth, 0, 23, 59, 59, 999);

  // Всі записи за місяць
  const waterEntries = await WaterCollection.find({
    userId,
    date: { $gte: start, $lt: end },
  })
    .sort({ date: 1 })
    .lean();

  // По днях
  const groupedByDay = waterEntries.reduce((acc, entry) => {
    const day = new Date(entry.date).getDate(); // Число дня
    // Додаємо обсяг води за цей день
    acc[day] = (acc[day] || 0) + entry.volume;
    return acc;
  }, {});

  // Роблю масив УСІХ днів місяця
  const daysInMonth = new Date(inputYear, inputMonth, 0).getDate(); // Тут саме кількість днів в місяць який треба

  // Тут робиться відповідь масивом по дням
  const result = Array.from({ length: daysInMonth }, (_, i) => {
    const formattedDate = `${inputYear}-${String(inputMonth).padStart(
      2,
      '0',
    )}-${String(i + 1).padStart(2, '0')}`;
    return { date: formattedDate, stats: groupedByDay[i + 1] || 0 };
  });

  return result;
};
