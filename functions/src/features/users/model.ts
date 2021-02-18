import {
    StoreId,
    EmployeePrivateKey,
} from "../stores/model";


/**
 * The custom claims used on Firebase's built in user objects.
 */
export interface CustomClaims {
    isEmployee: {
        [store in StoreId]: EmployeePrivateKey
    }
}
