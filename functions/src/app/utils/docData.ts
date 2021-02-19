import { Response } from 'express';
import * as admin from 'firebase-admin';
import { PathIncludingDocumentId, ResponseLocalsAuthenticated, ResponseLocalsComplete } from '../model';


/**
 * Places DocumentData from a Firestore request into the response object.
 * 
 * Hence, the information will be easily acceptable from other callbacks.
 * 
 * @param response - The object used to send a response
 * @param path - The unique path in Firestore to the document
 * @param docData - The data retrieved from the document
 */
export const addDocumentDataToResponse = (
    response: Response, path: PathIncludingDocumentId, docData: admin.firestore.DocumentData
): void => {
    const { documentData, ...restOfLocals } = response.locals as ResponseLocalsAuthenticated;
    const newDocumentData = {
        ...documentData,
        [path]: docData,
    };
    const newLocals: ResponseLocalsComplete = {
        ...restOfLocals,
        documentData: newDocumentData,
    }
    response.locals = newLocals;
};

/**
 * Retrieves DocumentData from the response object.
 * 
 * Pre-condition: addDocumentDataToResponse has been called with the same path.
 * 
 * @param response - The object used to send a response
 * @param path - The unique path in Firestore to the document
 */
export const getDocumentDataFromResponse = (
    response: Response, path: PathIncludingDocumentId
): admin.firestore.DocumentData => {
    const { documentData } = response.locals as ResponseLocalsComplete;
    const docData: admin.firestore.DocumentData = (
        documentData && documentData[path] ? documentData[path] : {}
    );
    return docData;
}
