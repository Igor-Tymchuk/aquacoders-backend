import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  if (!file || !file.path) throw new Error('Invalid file');

  try {
    const response = await cloudinary.uploader.upload(file.path);
    return response.secure_url;
  } catch (error) {
    console.error('Cloudinary error:', error);
    throw error;
  } finally {
    try {
      await fs.unlink(file.path);
    } catch (unlinkError) {
      console.error('Failed to delete local file:', unlinkError);
    }
  }
};
