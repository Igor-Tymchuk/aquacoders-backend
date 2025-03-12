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
import { validateQuery } from '../middlewares/validateBody.js';

import {
  addWaterSchema,
  monthlyWaterSchema,
  updateWaterSchema,
} from '../validation/water.js';

import { authenticate } from '../middlewares/authenticate.js';

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
  validateBody(updateWaterSchema),
  ctrlWrapper(updateWaterController),
);

// видалити
router.delete('/:id', authenticate, ctrlWrapper(deleteWaterController));

// за день
router.get('/daily', authenticate, ctrlWrapper(getDailyWaterController));

// за місяць
router.get(
  '/monthly',
  authenticate,
  validateQuery(monthlyWaterSchema),
  ctrlWrapper(getMonthlyWaterController),
);

export default router;
