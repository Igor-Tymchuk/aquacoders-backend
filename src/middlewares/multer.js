import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from '../constants/index.js';
import createHttpError from 'http-errors';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(createHttpError(400, 'No file uploaded'));
  }

  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      createHttpError(400, 'Invalid file type. Allowed: jpg, jpeg, png, webp'),
    );
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
