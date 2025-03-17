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
import { validateQuery } from '../middlewares/validateQuery.js';

import {
  addWaterSchema,
  monthlyWaterSchema,
  dailyWaterSchema,
  updateWaterSchema,
} from '../validation/water.js';

import { authenticate } from '../middlewares/authenticate.js';

import { validateId } from '../middlewares/validateId.js';

const router = Router();

// Додати запис
router.post(
  '/',
  authenticate,
  validateBody(addWaterSchema),
  ctrlWrapper(addWaterController),
);

// оновити
router.patch(
  '/:id',
  authenticate,
  validateId,
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

// видалити
router.delete(
  '/:id',
  authenticate,
  validateId,
  ctrlWrapper(deleteWaterController),
);

// за день
router.get(
  '/daily',
  authenticate,
  validateQuery(dailyWaterSchema),
  ctrlWrapper(getDailyWaterController),
);

// за місяць
router.get(
  '/monthly',
  authenticate,
  validateQuery(monthlyWaterSchema),
  ctrlWrapper(getMonthlyWaterController),
);

export default router;
