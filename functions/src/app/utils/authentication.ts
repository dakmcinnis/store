import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
import { ResponseLocals, ResponseLocalsAuthenticated, UserInfo } from '../model';


/**
 * Returns the tokenId from the authorization header of a request.
 * 
 * Assumes that the authorization header is in the format `bearer <tokenId>`.
 * If the authorization header is missing or is in an invalid format,
 * then it returns the empty string.
 * 
 * @param request - The object that should contain an authorization header
 */
export const getAuthorizationToken = (request: Request): string => {
    const authorization = request.headers.authorization;
    if (authorization) {
        const authArray = authorization.trim().split(' ');
        if (authArray.length === 2 && authArray[0].toLowerCase() === 'bearer') {
            return authArray[1];
        }
    }
    return '';
};

/**
 * Places UserInfo from a decoded token into the response object.
 * 
 * Hence, the information will be easily acceptable from other callbacks.
 * 
 * @param response - The object used to send a response
 * @param decodedToken - Contains UserInfo, which is retrieved after validating that someone isAuthenticated
 */
export const addUserInfoToResponse = async (response: Response, decodedToken: admin.auth.DecodedIdToken): Promise<void> => {
    const isEmployee = await admin.auth()
        .getUserByEmail(decodedToken.email as string)
        .then((user: UserRecord) => user.customClaims?.isEmployee || {})
        .catch(() => ({}));
    const userInfo: UserInfo = {
        uid: decodedToken.uid,
        email: decodedToken.email as string,
        displayName: decodedToken.displayName,
        isEmployee,
    };
    const newLocals: ResponseLocals = {
        ...(response.locals as ResponseLocals),
        userInfo,
    };
    response.locals = newLocals;
}

/**
 * Retrieves UserInfo from the response object.
 * 
 * Pre-condition: addUserInfoToResponse has been called.
 * 
 * @param response - The object used to send a response
 */
export const getUserInfoFromResponse = (response: Response): UserInfo => {
    const locals = response.locals as ResponseLocalsAuthenticated;
    const { uid, email, displayName, isEmployee } = locals.userInfo;
    return ({ uid, email, displayName, isEmployee });
}
