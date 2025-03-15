import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  inputUserSchema,
  loginWithGoogleOAuthSchema,
  refreshTokenSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  updateUserSchema,
} from '../validation/users.js';
import {
  signinUserController,
  logoutUserController,
  refreshUserSessionController,
  signupUserController,
  getCurrentUserController,
  requestResetEmailController,
  resetPasswordController,
  updateUserController,
  updateUserAvatarController,
  getUsersCounterController,
  getGoogleOAuthUrlController,
  loginWithGoogleController,
} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import handleMulterError from '../middlewares/handleMulterError.js';
const router = Router();

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(loginWithGoogleController),
);

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
router.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  ctrlWrapper(refreshUserSessionController),
);
router.post('/logout', ctrlWrapper(logoutUserController));
router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));
router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

router.patch(
  '/',
  authenticate,
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

router.patch(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  handleMulterError,
  ctrlWrapper(updateUserAvatarController),
);

router.get('/counter', ctrlWrapper(getUsersCounterController));

export default router;
