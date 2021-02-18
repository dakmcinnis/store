import * as express from 'express';
import * as UsersController from './controller';
import * as Middleware from '../../app/middleware';

const router = express.Router();

router.post('/signup', UsersController.signup_POST);
router.get('/get', Middleware.isAuthenticated, UsersController.getUser_GET);

export default router;