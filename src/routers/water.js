import { Router } from 'express';

import {
  addWaterController,
  updateWaterController,
  deleteWaterController,
  getDailyWaterController,
  getMonthlyWaterController,
} from '../controllers/water.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

// Додати запис
router.post('/', ctrlWrapper(addWaterController));

// оновити
router.put('/:id', ctrlWrapper(updateWaterController));

// видалити
router.delete('/:id', ctrlWrapper(deleteWaterController));

// за день
router.get('/daily', ctrlWrapper(getDailyWaterController));

// за місяць
router.get('/monthly', ctrlWrapper(getMonthlyWaterController));

export default router;
