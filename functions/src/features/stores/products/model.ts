/**
 * The name of the stores > storeId > products collection.
 */
export const PRODUCTS_COLLECTION: string = 'products';

/**
 * The fields on a store's document.
 */
export interface ProductData extends FirebaseFirestore.DocumentData {
    id: string;
    name: string;
    productionCost: number; // float
    retailPrice: number; // float
    deliveryFee: number; // float
    inventory?: number; // integer
}
