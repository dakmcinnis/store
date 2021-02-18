import * as express from 'express';
import * as StoresController from './controller';

const router = express.Router();

router.post('/:storeId/create', StoresController.createStore_POST);
router.get('/:storeId/get', StoresController.getStore_GET);

export default router;