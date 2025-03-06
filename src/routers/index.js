import { Router } from 'express';
import waterRouter from './water.js';

const router = Router();

// console.log('Hello Router!');

router.use('/water', waterRouter);

export default router;
