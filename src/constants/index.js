import path from 'node:path';
import dotenv from 'dotenv';

export const GENDER_TYPES = ['male', 'female', 'none'];
export const THIRTY_MINUTES = 30 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

dotenv.config();

export const SMTP = {
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
    SMTP_FROM: process.env.SMTP_FROM || '',
  };
  export const JWT_SECRET = process.env.JWT_SECRET;
  
  export const APP_DOMAIN = process.env.APP_DOMAIN;
  
  export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
  
  export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
  export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');