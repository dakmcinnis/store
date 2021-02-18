import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import * as AppUtils from '../../app/utils';

/**
 * Signup a user to the Authentication Product.
 * 
 * @param request.query.email 'email' parameter as a string
 * @param request.query.password 'password' parameter as a string
 * @param request.query.displayName 'displayName' parameter as a string
 */
export const signup_POST = (request: Request, response: Response) => {
    const email = request.query.email as string;
    const password = request.query.password as string;
    const displayName = request.query.displayName as string;
    if (!email || !password || !displayName) {
        AppUtils.handleMissingFieldError(response, AppUtils.FieldType.parameters);
    }
    return admin.auth().createUser({
        email,
        password,
        displayName,
    }).then(() => {
        response.status(200).end();
    }).catch((error) => {
        AppUtils.handleGeneralError(response, error);
    });
};

/**
 * Access one's own user object from the Authentication Product. 
 */
export const getUser_GET = (request: Request, response: Response) => {
    const { email } = AppUtils.getUserInfoFromResponse(response);
    return admin.auth().getUserByEmail(email)
        .then((user: admin.auth.UserRecord) => {
            response.status(200).send(user);
        })
        .catch((error) => {
            AppUtils.handleGeneralError(response, error);
        });
};
