import * as express from 'express';
import * as Middleware from '../../app/middleware';
import * as StoresController from './controller';
import { STORES_COLLECTION } from './model';
import * as ProductsController from './products/controller';

const router = express.Router();

/* Store Endpoints */

router.post(
    '/:storeId/create',
    Middleware.isNotExistingDocument(STORES_COLLECTION, 'storeId'),
    StoresController.createStore_POST
);

router.put(
    '/:storeId/addEmployee',
    Middleware.isExistingDocument(STORES_COLLECTION, 'storeId'),
    Middleware.isAuthorized({ isEmployee: true }),
    StoresController.addEmployeeByEmail_PUT
);

router.get(
    '/:storeId/get',
    Middleware.isExistingDocument(STORES_COLLECTION, 'storeId'),
    StoresController.getStore_GET
);

/* Store > Product Endpoints */

router.post(
    '/:storeId/products/:productId/create',
    Middleware.isAuthorized({ isEmployee: true }),
    ProductsController.createProduct_POST
);

export default router;