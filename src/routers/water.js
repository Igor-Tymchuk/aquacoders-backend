import { Router } from 'express';

import {
  addWaterController,
  updateWaterController,
  deleteWaterController,
  getDailyWaterController,
  getMonthlyWaterController,
} from '../controllers/water.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import { addWaterSchema, updateWaterSchema } from '../validation/water.js';

const router = Router();

// Додати запис
router.post('/', validateBody(addWaterSchema), ctrlWrapper(addWaterController));

// оновити
router.put(
  '/:id',
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

// видалити
router.delete('/:id', ctrlWrapper(deleteWaterController));

// за день
router.get('/daily', ctrlWrapper(getDailyWaterController));

// за місяць
router.get('/monthly', ctrlWrapper(getMonthlyWaterController));

export default router;
