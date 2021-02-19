import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import * as AppUtils from '../../app/utils';
import { StoreId } from '../stores/model';
import { InternalUser, PublicFacingUser } from './model';

/**
 * Signup a user to the Authentication Product.
 * 
 * @param request.query.email 'email' parameter as a string
 * @param request.query.password 'password' parameter as a string
 * @param request.query.displayName 'displayName' parameter as a string
 */
export const signup_POST = async (request: Request, response: Response) => {
    // Validate parameters
    const email = request.query.email as string;
    const password = request.query.password as string;
    const displayName = request.query.displayName as string;
    if (!email || !password || !displayName) {
        AppUtils.handleMissingFieldError(response, AppUtils.FieldType.parameters);
    }

    // Verify that user does not exist
    const userExists = await admin.auth().getUserByEmail(email)
        .then((user: UserRecord) => !!user)
        .catch(() => false);
    if (userExists) {
        AppUtils.handleResourceAlreadyExistsError(response, 'user email', `The email ${email}`);
        return;
    }

    // Create user
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
 * 
 * @param request.query.debug Optional 'debug' parameter as boolean, which allows for employeePrivateKeys to be shown
 * 
 * TODO: remove debug parameter.
 */
export const getUser_GET = (request: Request, response: Response<PublicFacingUser | InternalUser>) => {
    // eslint-disable-next-line eqeqeq
    const debug = !!request.query.debug && (request.query.debug == 'true');
    const { email } = AppUtils.getUserInfoFromResponse(response);
    return admin.auth().getUserByEmail(email)
        .then((user: admin.auth.UserRecord) => {
            if (debug) {
                // Show full user object
                response.status(200).send(user as InternalUser);
            } else {
                // Show user object, obscuring the employeePrivateKeys
                // (i.e. the 'isEmployee' array becomes a map)
                const { customClaims, ...restOfUser } = user as InternalUser;
                const { isEmployee, ...restOfCustomClaims } = customClaims;
                const companyArray: StoreId[] = Object.keys(isEmployee || {});
                const publicFacingUser: PublicFacingUser = {
                    ...restOfUser,
                    customClaims: {
                        ...restOfCustomClaims,
                        isEmployee: companyArray,
                    },
                }
                response.status(200).send(publicFacingUser);
            }
        })
        .catch((error) => {
            AppUtils.handleGeneralError(response, error);
        });
};
