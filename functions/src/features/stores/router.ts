import * as express from 'express';
import * as Middleware from '../../app/middleware';
import { DocumentByParam } from '../../app/model';
import * as StoresController from './controller';
import { STORES_COLLECTION, SUB_COLLECTIONS } from './model';
import * as ProductsController from './products/controller';

const router = express.Router();

/* Data for Document Existence Checking */

const storeDocData = {
    parentCollection: STORES_COLLECTION,
    paramName: 'storeId',
};

const storeDocExist: DocumentByParam = {
    ...storeDocData,
    shouldExist: true,
};

const storeDocNotExist: DocumentByParam = {
    ...storeDocData,
    shouldExist: false,
};

const productDocData = {
    parentCollection: SUB_COLLECTIONS.products,
    paramName: 'productId',
};

const productDocExist: DocumentByParam = {
    ...productDocData,
    shouldExist: true,
}

const productDocNotExist: DocumentByParam = {
    ...productDocData,
    shouldExist: false,
}

const DOC = {
    store: {
        exist: storeDocExist,
        notExist: storeDocNotExist,
    },
    product: {
        exist: productDocExist,
        notExist: productDocNotExist,
    },
};

/* Store Endpoints */

router.post(
    '/:storeId/create',
    Middleware.verifyDocumentPath([DOC.store.notExist]),
    StoresController.createStore_POST
);

router.put(
    '/:storeId/addEmployee',
    Middleware.verifyDocumentPath([DOC.store.exist]),
    Middleware.isAuthorized({ isEmployee: true }),
    StoresController.addEmployeeByEmail_PUT
);

router.get(
    '/:storeId/get',
    Middleware.verifyDocumentPath([DOC.store.exist]),
    StoresController.getStore_GET
);

/* Store > Product Endpoints */

router.post(
    '/:storeId/products/:productId/create',
    Middleware.verifyDocumentPath([DOC.store.exist, DOC.product.notExist]),
    Middleware.isAuthorized({ isEmployee: true }),
    ProductsController.createProduct_POST
);

router.get(
    '/:storeId/products/:productId/get',
    Middleware.verifyDocumentPath([DOC.store.exist, DOC.product.exist]),
    ProductsController.getProductById_GET
);

export default router;