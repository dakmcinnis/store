import * as admin from 'firebase-admin';
import {
    EmployeePrivateKey,
    StoreData,
    StoreId,
    STORES_COLLECTION,
} from './model';


export const getStoresCollectionRef = (): admin.firestore.CollectionReference => (
    admin.firestore().collection(STORES_COLLECTION)
);

export const getStoreRefById = (storeId: string): admin.firestore.DocumentReference => (
    getStoresCollectionRef().doc(storeId)
);

export const createStore = async (storeId: string, storeData: StoreData): Promise<void> => {
    await getStoreRefById(storeId).set(storeData);
}

export const addEmployee = async (
    uid: string,
    isEmployee: { [store in StoreId]: EmployeePrivateKey },
    storeId: string,
    employeePrivateKey: string
): Promise<void> => {
    const customClaims = {
        isEmployee: {
            ...isEmployee,
            [storeId]: employeePrivateKey,
        },
    };
    await admin.auth().setCustomUserClaims(uid, customClaims);
}

/**
 * Generate a random string of fixed length.
 * 
 * @param length the length of the string returned
 * @returns a string of length `length`
 */
export const generateRandomString = (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};