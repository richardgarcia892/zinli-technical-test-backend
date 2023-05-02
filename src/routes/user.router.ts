import { Router } from 'express';

import {
  fetch,
  fetchAll,
  create,
  remove,
  update,
  fetchUserProfile,
  updateUserProfile,
} from '../controllers/user.controller';
import { isSignedIn } from '../controllers/auth.controller';
import { validatorHandler } from '../controllers/validation.controller';
import { updateUserProfileSchema } from '../schemas/userAuth.schema';

const router = Router();

// Update profile
router.get('/profile', isSignedIn, fetchUserProfile);
router.patch('/profile', validatorHandler(updateUserProfileSchema, 'body'), isSignedIn, updateUserProfile);

// User CRUD
// TODO: finish the CRUD
router.get('/', fetch);
router.get('/:userId', fetchAll);
router.post('/', create);
router.patch('/:userId', update);
router.delete('/:userId', remove);

export default router;
