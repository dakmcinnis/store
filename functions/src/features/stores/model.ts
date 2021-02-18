/**
 * The name of the root-level stores collection.
 */
export const STORES_COLLECTION: string = 'stores';

/**
 * The id of a store. This will be its document id.
 */
export type StoreId = string;

/**
 * The name of a store.
 */
export type StoreName = string;

/**
 * A private key for members of a store.
 */
export type EmployeePrivateKey = string;

/**
 * The fields on a store's document.
 */
export interface StoreData extends FirebaseFirestore.DocumentData {
    storeId: StoreId;
    storeName: StoreName;
    owner: {
        name?: string; // TODO: Write trigger to keep updated
        uid: string;
        email: string; // TODO: Write trigger to keep updated
    }
    supportEmail: string;
    employeePrivateKey: EmployeePrivateKey;
}

export type PublicFacingStoreData = Omit<StoreData, 'owner' | 'employeePrivateKey'>;
export type EmployeeFacingStoreData = Omit<StoreData, 'employeePrivateKey'>;

/**
 * The sub-collections of a store document.
 */
export enum SUB_COLLECTIONS {
    product = 'product',
    sales = 'sales',
}
