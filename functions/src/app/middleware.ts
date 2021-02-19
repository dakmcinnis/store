import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Request, Response } from 'express';
import * as Utils from './utils';
import * as StoreUtils from '../features/stores/utils';
import * as StoreModels from '../features/stores/model';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { Path } from './model';

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
        admin.auth().verifyIdToken(token).then(async (decodedToken: admin.auth.DecodedIdToken) => {
            await Utils.addUserInfoToResponse(response, decodedToken);
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
 * Verifies whether documents along a path exist or not.
 * The expected result for each document is determined
 * by their 'shouldExist' property.
 * 
 * Pre-condition: This middleware is used for a request with URL parameters
 * whose values are the document Ids.
 *  
 * @param path - A path of documents, ordered by increase depth in Firestore
 */
export const verifyDocumentPath = (
    path: Path
) => (
    async (request: Request, response: Response, next: any) => {
        let fullPath = '';
        for (let index = 0; index < path.length; index++) {
            // Setup
            const item = path[index];
            const { shouldExist } = item;
            const collection = item.parentCollection;
            const documentId = request.params[item.paramName] || '';
            if (index > 0) {
                fullPath += '/';
            }
            // Document Read
            fullPath += collection;
            const collectionPath = fullPath;
            const docData: admin.firestore.DocumentData | undefined = await admin.firestore()
                .collection(fullPath)
                .doc(documentId)
                .get()
                .then((doc: admin.firestore.DocumentSnapshot) => (
                    doc.exists ? doc.data() : undefined
                ))
            fullPath += `/${documentId}`;
            // Handle unexpected behaviour
            if (shouldExist && !!docData) {
                Utils.addDocumentDataToResponse(response, fullPath, docData);
            } else if (shouldExist && !docData) {
                Utils.handleMissingRessourceError(
                    response, `document under '${collectionPath}'`, `with id '${documentId}'`
                );
                return;
            } else if (!shouldExist && !!docData) {
                Utils.handleResourceAlreadyExistsError(
                    response, `document id`, `The document with id '${documentId}' under '${collectionPath}'`
                )
                return;
            }
        }
        next();
    }
);
