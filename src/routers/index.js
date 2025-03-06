import { Router } from 'express';
import waterRouter from './water.js';
import authRouter from './auth.js'

const router = Router();

// console.log('Hello Router!');

router.use('/auth', authRouter);
router.use('/water', waterRouter);

export default router;
