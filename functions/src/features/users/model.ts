import * as admin from 'firebase-admin';
import {
    StoreId,
    EmployeePrivateKey,
} from "../stores/model";


/**
 * The custom claims used on Firebase's built in user objects.
 * 
 * Note: isEmployee is only undefined when the user is first created.
 * Immediately following the creation of a user, this will be populated with
 * `intialCustomClaims`.
 */
export interface CustomClaims {
    isEmployee?: {
        [store in StoreId]: EmployeePrivateKey
    }
}

/**
 * The initial state of our custom claims, immediately after a user is created.
 */
export const initialCustomClaims: CustomClaims = {
    isEmployee: {},
};

/**
 * The internal model of our users.
 */
export interface InternalUser extends admin.auth.UserRecord {
    customClaims: CustomClaims;
}

/**
 * The user model shown upon requests.
 */
export interface PublicFacingUser extends admin.auth.UserRecord {
    customClaims: {
        isEmployee: StoreId[];
    };
};
