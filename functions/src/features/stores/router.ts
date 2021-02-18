import * as express from 'express';
import * as Middleware from '../../app/middleware';
import * as StoresController from './controller';
import * as ProductsController from './products/controller';

const router = express.Router();

/* Store Endpoints */
router.post('/:storeId/create', StoresController.createStore_POST);
router.get('/:storeId/get', StoresController.getStore_GET); // Returns different values if you're an employee
router.post(
    '/:storeId/addEmployee',
    Middleware.isAuthorized({ isEmployee: true }),
    StoresController.addEmployeeByEmail_POST
);

/* Store > Product Endpoints */
router.post(
    '/:storeId/products/:productId/create',
    Middleware.isAuthorized({ isEmployee: true }),
    ProductsController.createProduct_POST
);

export default router;