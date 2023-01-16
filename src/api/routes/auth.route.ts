import { Router } from 'express';
import { loginUserHandler, logoutUserHandler, refreshTokenHandler, registerUserHandler } from '../controllers/auth.controller';
import { checkAuth } from '../middleware/auth.middleware';
import { checkEmailExists, checkUsernameExists } from '../validations';

const router = Router();

router.post('/register', checkEmailExists, checkUsernameExists, registerUserHandler);
router.post('/login', loginUserHandler);
router.post('/logout', checkAuth, logoutUserHandler);
router.post('/refresh_token', refreshTokenHandler);

export default router;
