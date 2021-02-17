import * as express from 'express';
import * as UsersController from './controller';

const router = express.Router();

router.post('/signup', UsersController.signup_post);

export default router;