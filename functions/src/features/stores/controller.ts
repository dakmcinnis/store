import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import * as AppUtils from '../../app/utils';
import * as StoreUtils from './utils';
import {
    EmployeeFacingStoreData,
    PublicFacingStoreData,
    StoreData,
    STORES_COLLECTION,
} from './model';
import { InternalUser } from '../users/model';


/**
 * Create a store, where the authenticated user is the owner.
 *
 * @param request.query.storeName 'storeName' parameter as a string
 * @param request.query.supportEmail 'supportEmail' parameter as a string
 */
export const createStore_POST = async (request: Request, response: Response) => {
    // Collect UserInfo
    const { email, displayName, uid, isEmployee } = AppUtils.getUserInfoFromResponse(response);

    // Validate that the parameters exist
    const storeId = request.params.storeId;
    const { storeName, supportEmail } = request.query as {
        storeName: string, supportEmail: string
    };
    if (!storeId || !storeName || !supportEmail) {
        AppUtils.handleMissingFieldError(response, AppUtils.FieldType.parameters);
    }

    // Create the store
    const employeePrivateKey = StoreUtils.generateRandomString(`${storeName}-${email}-${displayName}`.length);

    const owner = !!displayName ? ({
        name: displayName,
        uid,
        email,
    }) : ({ uid, email });

    const storeData: StoreData = {
        storeId: storeId,
        storeName: storeName,
        owner,
        supportEmail,
        employeePrivateKey,
    };

    await StoreUtils.createStore(storeId, storeData)
        .then(() => { return; })
        .catch(error => {
            AppUtils.handleGeneralError(response, error);
        });

    // Add the owner as an employee
    await StoreUtils.addEmployee(uid, isEmployee || {}, storeId, employeePrivateKey);

    response.status(200).end();
};

/**
 * Get information about a store.
 * 
 * If you are an employee of the store, the owner information will be provided.
 */
export const getStore_GET = async (
    request: Request, response: Response
) => {
    // Get information about authenticated user
    const { email } = AppUtils.getUserInfoFromResponse(response);

    // Get information about store
    const storeId = request.params.storeId;
    const storeData = AppUtils.getDocumentDataFromResponse(response, `${STORES_COLLECTION}/${storeId}`);
    const { employeePrivateKey, ...employeeFacingStoreData } = storeData as StoreData;
    const { owner, ...publicFacingStoreData } = employeeFacingStoreData as EmployeeFacingStoreData;

    // Determine if user is an employee
    const isEmployee: boolean = await admin.auth()
        .getUserByEmail(email)
        .then((user: admin.auth.UserRecord) => {
            const foundKey = (user.customClaims?.isEmployee[storeId] || '') as string;
            return foundKey === employeePrivateKey;
        })
        .catch(() => false);

    // Return the appropriate subset of StoreData
    const data: EmployeeFacingStoreData | PublicFacingStoreData = (
        isEmployee ? employeeFacingStoreData : publicFacingStoreData
    );

    response.status(200).send(data);
}

/**
 * Add an employee to a store.
 * 
 * @param request.query.employeeEmail 'employeeEmail' parameter as a string
 */
export const addEmployeeByEmail_PUT = async (request: Request, response: Response) => {
    // Validate that the parameters exist
    const employeeEmail = request.query.employeeEmail as string;
    if (!employeeEmail) {
        AppUtils.handleMissingFieldError(response, AppUtils.FieldType.parameters);
    }

    // Get user record for individual being added as an employee
    const userMayBeNull: InternalUser | null = await admin.auth()
        .getUserByEmail(employeeEmail)
        .then((userRecord: admin.auth.UserRecord) => userRecord as InternalUser)
        .catch(error => {
            AppUtils.handleMissingRessourceError(response, 'user with email', employeeEmail);
            return null;
        });
    const user = userMayBeNull as InternalUser;

    // Get information about store
    // Note: based on authorization, we know the store already exists
    const storeId = request.params.storeId;
    const storeData = AppUtils.getDocumentDataFromResponse(response, `${STORES_COLLECTION}/${storeId}`);
    const { employeePrivateKey } = storeData as StoreData;

    // Add user as employee (note: if they are already an employee, this is a safe operation)
    const { uid, customClaims: { isEmployee } } = user;
    await StoreUtils.addEmployee(uid, isEmployee || {}, storeId, employeePrivateKey);

    response.status(200).end();
}
