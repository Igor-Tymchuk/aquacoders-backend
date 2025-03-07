import { Router } from 'express';
import waterRouter from './water.js';
import usersRouter from './users.js';

const router = Router();

// console.log('Hello Router!');

router.use('/users', usersRouter);
router.use('/water', waterRouter);

export default router;
