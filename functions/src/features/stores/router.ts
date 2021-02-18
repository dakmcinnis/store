import * as express from 'express';
import * as Middleware from '../../app/middleware';
import * as StoresController from './controller';

const router = express.Router();

router.post('/:storeId/create', StoresController.createStore_POST);
router.get('/:storeId/get', StoresController.getStore_GET); // Returns different values if you're an employee
router.post(
    '/:storeId/addEmployee',
    Middleware.isAuthorized({ isEmployee: true }),
    StoresController.addEmployeeByEmail_POST
);

export default router;