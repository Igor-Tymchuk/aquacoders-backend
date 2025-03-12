import multer from 'multer';

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: 400,
      message: 'BadRequestError',
      data: { message: err.message },
    });
  } else if (err) {
    return res.status(400).json({
      status: 400,
      message: 'BadRequestError',
      data: { message: err.message || 'Bad request' },
    });
  }
  next();
};

export default handleMulterError;
