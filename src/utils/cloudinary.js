import { v2 as cloudinary } from 'cloudinary'; // Правильный импорт
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.config({
  // Используем cloudinary напрямую, без v2
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    console.log('File path:', file.path); // Добавлено логирование

    const response = await cloudinary.uploader.upload(file.path); // Используем cloudinary напрямую
    // Проверяем, существует ли файл перед удалением
    try {
      await fs.access(file.path);
      await fs.unlink(file.path);
    } catch (unlinkError) {
      console.warn('File unlink error:', unlinkError); // Логируем ошибку, но не прерываем выполнение
    }
    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary error:', error);
    throw error; // Важно пробросить ошибку дальше, чтобы ее обработал контроллер
  }
};
