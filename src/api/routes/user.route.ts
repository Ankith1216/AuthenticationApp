import { Router } from 'express';
import { getUserHandler } from '../controllers/user.controller';
import { checkAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/home', checkAuth, getUserHandler);

export default router;