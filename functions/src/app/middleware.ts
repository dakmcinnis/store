import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Request, Response } from 'express';
import { getAuthorizationToken } from './utils';

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
export const authentication = (request: Request, response: Response, next: any) => {
    const token = getAuthorizationToken(request);
    if (token) {
        admin.auth().verifyIdToken(token).then((decodedToken) => {
            const email = decodedToken.email;
            functions.logger.info(
                `The user with email ${email} is authenticated for ${request.method} request ${request.originalUrl}.`
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