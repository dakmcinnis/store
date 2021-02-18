import * as admin from 'firebase-admin';
import { getStoreRefById } from '../utils';
import { ProductData, PRODUCTS_COLLECTION } from './model';

export const getProductRefById = (storeId: string, productId: string): admin.firestore.DocumentReference => (
    getStoreRefById(storeId).collection(PRODUCTS_COLLECTION).doc(productId)
);

export const createProduct = async (storeId: string, productId: string, productData: ProductData): Promise<void> => {
    await getProductRefById(storeId, productId).set(productData)
};