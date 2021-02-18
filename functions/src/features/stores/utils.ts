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

/**
 * Verifies that the input string contains only numbers as characters.
 */
export const isCount = (str?: string): boolean => (
    !!str && !!str.length && !!str.match(/^[0-9]+$/)
)

/**
 * Convert the count string to an integer number.
 * 
 * Pre-condition: isCount(str) returns true
 */
export const getCount = (str: string): number => (
    parseInt(str)
);

/**
 * Verifies that the input string contains almost all numbers,
 * other than a decimal point followed by two numbers.
 * 
 * Examples:
 * - for `1.00`, returns true
 * - for `1234.00`, returns true
 * - for `1`, returns false
 * - for `1.001`, returns false
 */
export const isMoneyFormat = (str?: string): boolean => (
    !!str && !!str.length && !!str.match(/^[0-9]+[.][0-9][0-9]$/)
)

/**
 * Convert the money string to number.
 * 
 * Pre-condition: isMoneyFormat(str) returns true
 */
export const getMoney = (str: string): number => (
    parseFloat(str)
);
