import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { inputUserSchema } from '../validation/users.js';
import {
  signinUserController,
  logoutUserController,
  refreshUserSessionController,
  signupUserController,
  getCurrentUserController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import { updateUserSchema } from '../validation/users.js';
import { updateUserController } from '../controllers/users.js';

const router = Router();

router.post(
  '/signup',
  validateBody(inputUserSchema),
  ctrlWrapper(signupUserController),
);
router.post(
  '/signin',
  validateBody(inputUserSchema),
  ctrlWrapper(signinUserController),
);
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));
router.patch(
  '/:id',
  authenticate,
  upload.single('avatarUrl'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

export default router;
