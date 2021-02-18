import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Request, Response } from 'express';
import * as Utils from './utils';
import * as StoreUtils from '../features/stores/utils';
import * as StoreModels from '../features/stores/model';
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

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
            functions.logger.info(store.data(), { structuredData: true });
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
