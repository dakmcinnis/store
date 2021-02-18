import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import * as AppUtils from '../../app/utils';
import * as StoreUtils from './utils';
import {
    EmployeeFacingStoreData,
    StoreData,
} from './model';


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

    // Validate that the store does not exist
    const docExists = await StoreUtils.getStoreRefById(storeId).get().then((doc) => doc.exists).catch(() => false);
    if (docExists) {
        AppUtils.handleResourceAlreadyExistsError(response, 'storeId', storeId);
    }

    // Since it does not exist, create the store
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
        uid,
        email,
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
 * If you are an employee of the store, more information will be provided.
 */
export const getStore_GET = async (request: Request, response: Response) => {
    // Get information about authenticated user
    const { email } = AppUtils.getUserInfoFromResponse(response);

    // Get information about store
    const storeId = request.params.storeId;
    const storeData = await StoreUtils.getStoreRefById(storeId)
        .get()
        .then((doc: admin.firestore.DocumentSnapshot) => (
            doc.exists ? doc.data() : undefined
        ))
        .catch(() => undefined);
    if (!storeData) {
        AppUtils.handleGeneralError(response);
    }
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
    response.status(200).send(isEmployee ? employeeFacingStoreData : publicFacingStoreData);
}
