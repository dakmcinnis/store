import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import * as Utils from '../../app/utils';

/**
 * Handle post request to signup a user to the Authentication Product.
 * 
 * @param request
 * @param response 
 */
export const signup_post = (request: Request, response: Response) => {
    const email = request.query.email as string;
    const password = request.query.password as string;
    const displayName = request.query.displayName as string;
    if (!email || !password || !displayName) {
        Utils.handleMissingFieldError(response, Utils.FieldType.parameters);
    }
    return admin.auth().createUser({
        email,
        password,
        displayName,
    }).then(() => {
        response.status(200).end();
    }).catch(() => {
        response.sendStatus(500);
    });
};
