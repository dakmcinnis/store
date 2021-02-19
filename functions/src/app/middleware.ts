import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Request, Response } from 'express';
import * as Utils from './utils';
import * as StoreUtils from '../features/stores/utils';
import * as StoreModels from '../features/stores/model';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { PathIncludingDocumentId } from './model';

/**
 * Logs the request method and url to the firebase-functions.
 */
export const logging = (request: Request, response: Response, next: any) => {
    functions.logger.info(
        `Executing express endpoint: ${request.method} ${request.originalUrl}`
    );
    next();
}

/**
 * Verifies that a valid idToken has been provided through the 'authorization' header.
 * 
 * If it has, the request will pass through to the endpoint logic. Otherwise, an
 * unauthorized status will be sent.
 */
export const isAuthenticated = (request: Request, response: Response, next: any) => {
    const token = Utils.getAuthorizationToken(request);
    if (token) {
        admin.auth().verifyIdToken(token).then((decodedToken: admin.auth.DecodedIdToken) => {
            Utils.addUserInfoToResponse(response, decodedToken);
            functions.logger.info(
                `${request.method} request ${request.url}: The user with email ${decodedToken.email} is authenticated.`
            );
            next();
        }).catch(() => {
            // token could not be verified (whether expired or incorrect)
            response.sendStatus(403);
        })
    } else {
        // authorization header is missing or has invalid format
        response.sendStatus(403);
    }
};

/**
 * Verifies that the individual performing the request is authorized.
 * 
 * Pre-condition: isAuthenticated has been run, to populate data into `response.locals`.
 */
export const isAuthorized = ({ isEmployee }: { isEmployee: boolean }) => (
    isEmployee ? isAuthorizedEmployee : isAuthorizedPassThrough
);

const isAuthorizedPassThrough = (request: any, response: Response, next: any) => {
    next();
}

const isAuthorizedEmployee = async (request: Request, response: Response, next: any): Promise<void> => {
    const storeId: StoreModels.StoreId = request.params.storeId || '';
    const { email, isEmployee } = { isEmployee: {}, ...Utils.getUserInfoFromResponse(response) };
    return StoreUtils.getStoreRefById(storeId)
        .get()
        .then((store: DocumentSnapshot) => {
            const employeePrivateKey: string = (store.data()?.employeePrivateKey || '') as string;
            if (isEmployee[storeId] === employeePrivateKey) {
                functions.logger.info(
                    `${request.method} request ${request.url}: The user with email ${email} is an employee of ${storeId}.`
                );
                next();
            } else {
                functions.logger.info(
                    `${request.method} request ${request.url}: The user with email ${email} is not an employee of ${storeId}.`
                );
                response.sendStatus(403);
            }
        })
        .catch(error => {
            Utils.handleGeneralError(response, error);
        });
};

/**
 * Verifies that a particular document does exist.
 * If it does not exist, the request will not proceed.
 * 
 * Pre-condition: This middleware is used for a request with a URL parameter
 * that is equal to the documentId.
 *  
 * @param collectionPath - The path from the root-level to the collection potentially containing the document
 *  - Ex: If the document is found at  "collection 'upper' > document 'a' > collection 'lower'",
 *    then colloectionPath would be "upper/a/lower".
 * @param documentIdParamName - The URL parameter name which provides the documentId as a value
 *  - Ex: If the request URL contained a parameter called "documentId",
 *    then this string should be "documentId".
 */
export const isExistingDocument = (
    collectionPath: string,
    documentIdParamName: string,
) => (
    existingDocument(collectionPath, documentIdParamName, true)
)

/**
 * Verifies that a particular document does not exist.
 * If it does exist, the request will not proceed.
 * 
 * Pre-condition: This middleware is used for a request with a URL parameter
 * that is equal to the documentId.
 *  
 * @param collectionPath - The path from the root-level to the collection potentially containing the document
 *  - Ex: If the document is found at  "collection 'upper' > document 'a' > collection 'lower'",
 *    then colloectionPath would be "upper/a/lower".
 * @param documentIdParamName - The URL parameter name which provides the id of the document as a value
 *  - Ex: If the request URL contained a parameter called "documentId",
 *    then this string should be "documentId".
 */
export const isNotExistingDocument = (
    collectionPath: string,
    documentIdParamName: string,
) => (
    existingDocument(collectionPath, documentIdParamName, false)
)

/**
 * Verifies that a particular document does or does not exist.
 * The expected result is determined by @param shouldExist.
 * This determines whether the request can proceed.
 * 
 * Pre-condition: This middleware is used for a request with a URL parameter
 * that is equal to the documentId.
 *  
 * @param collectionPath - The path from the root-level to the collection containing the document
 *  - Ex: If the document is found at  "collection 'upper' > document 'a' > collection 'lower'",
 *    then colloectionPath would be "upper/a/lower".
 * @param documentIdParamName - The URL parameter name which provides the documentId as a value
 *  - Ex: If the request URL contained a parameter called "documentId",
 *    then this string should be "documentId".
 * @param shouldExist - Whether or not we expect the document to exist
 */
const existingDocument = (
    collectionPath: string,
    documentIdParamName: string,
    shouldExist: boolean
) => (
    async (request: Request, response: Response, next: any): Promise<void> => {
        // Get data
        const documentId = request.params[documentIdParamName] || '';
        const docData: admin.firestore.DocumentData | undefined = await admin.firestore()
            .collection(collectionPath)
            .doc(documentId)
            .get()
            .then((doc: admin.firestore.DocumentSnapshot) => (
                doc.exists ? doc.data() : undefined
            ))
            .catch(() => undefined);
        // Determine response
        const fullPath: PathIncludingDocumentId = `${collectionPath}/${documentId}`;
        if (shouldExist && !!docData) {
            Utils.addDocumentDataToResponse(response, fullPath, docData);
            next();
        } else if (shouldExist && !docData) {
            Utils.handleMissingRessourceError(
                response, `document under '${collectionPath}'`, `with id '${documentId}'`
            );
        } else if (!shouldExist && !!docData) {
            Utils.handleResourceAlreadyExistsError(
                response, `document id`, `The document with id '${documentId}' under '${collectionPath}'`
            )
        } else {
            next();
        }
    }
);
