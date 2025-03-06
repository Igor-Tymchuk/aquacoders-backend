import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { signinUserSchema, signupUserSchema} from '../validation/users.js';
import { signinUserController, logoutUserController, refreshUserSessionController, signupUserController} from '../controllers/users.js';
import { validateBody } from '../middlewares/validateBody.js';
import {authenticate} from '../middlewares/authenticate.js'

const router = Router();

router.post( '/signup', validateBody(signinUserSchema), ctrlWrapper(signupUserController));
router.post('/signin', validateBody(signupUserSchema), ctrlWrapper(signinUserController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));


export default router;