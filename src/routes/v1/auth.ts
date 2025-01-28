import express from 'express';
import { AuthController } from '../../controllers/auth.controller';
import passport from 'passport';

const router = express.Router();

router.post('/login', AuthController.login);
router.get(
  '/validate', 
  passport.authenticate('jwt', { session: false }), 
  AuthController.validateToken
);

export default router; 