import path from 'node:path';

export const GENDER_TYPES = ['male', 'female', 'none'];
export const THIRTY_MINUTES = 30 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
