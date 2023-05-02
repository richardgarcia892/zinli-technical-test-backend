import { Router } from 'express';
import {
  signup,
  signin,
  signout,
  forgotPasswordRequest,
  forgotPasswordUpdate,
  PasswordUpdate,
  activateAccount,
  isSignedIn,
  activateAccountRetry,
} from '../controllers/auth.controller';
import { validatorHandler } from '../controllers/validation.controller';
import {
  PasswordUpdateSchema,
  forgotPasswordRequestSchema,
  forgotPasswordUpdateSchema,
  signinSchema,
  signupSchema,
  retryActivationSchema,
} from '../schemas/userAuth.schema';

const router = Router();

// SignUp process
router.post('/signup', validatorHandler(signupSchema, 'body'), signup);
router.post('/signup/retry', validatorHandler(retryActivationSchema, 'body'), activateAccountRetry);
router.get('/signup/:token', activateAccount);

// SignIn
router.post('/signin', validatorHandler(signinSchema, 'body'), signin);
router.get('/signout', isSignedIn, signout);

// User password recovery
router.post('/resetpassword', validatorHandler(forgotPasswordRequestSchema, 'body'), forgotPasswordRequest);
router.patch('/resetpassword/:token', validatorHandler(forgotPasswordUpdateSchema, 'body'), forgotPasswordUpdate);

// User reset password from profile
router.patch('/updatepassword', isSignedIn, validatorHandler(PasswordUpdateSchema, 'body'), PasswordUpdate);

export default router;
