import { Request, Response } from 'express';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CustomClaims } from '../features/users/model';


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


export interface UserInfo extends CustomClaims {
    uid: string;
    email: string;
    displayName: string;
}

/**
 * Places UserInfo from a decoded token into the response object.
 * 
 * Hence, the information will be easily acceptable from other callbacks.
 * 
 * @param response - The object used to send a response
 * @param decodedToken - Contains UserInfo, which is retrieved after validating that someone isAuthenticated
 */
export const addUserInfoToResponse = (response: Response, decodedToken: admin.auth.DecodedIdToken): void => {
    const userInfo: UserInfo = {
        uid: decodedToken.uid,
        email: decodedToken.email as string,
        displayName: decodedToken.displayName,
        isEmployee: decodedToken.isEmployee,
    };
    response.locals = {
        ...response.locals,
        ...userInfo,
    };
}

/**
 * Retrieves UserInfo from the response object.
 * 
 * @param response - The object used to send a response
 */
export const getUserInfoFromResponse = (response: Response): UserInfo => {
    const { uid, email, displayName, isEmployee } = response.locals;
    return ({ uid, email, displayName, isEmployee });
}

export enum FieldType {
    headers = 'headers',
    parameters = 'query',
}

/**
 * Handles the response for a missing field.
 * 
 * @param response - The object used to send the response
 * @param fieldType - The type of field that had insufficient information
 */
export const handleMissingFieldError = (response: Response, fieldType: FieldType): void => {
    switch (fieldType) {
        case FieldType.headers:
            response.status(400).send('Missing required headers.');
            return;
        case FieldType.parameters:
            response.status(400).send('Missing required parameters.');
            return;
        default:
            response.sendStatus(400);
            return;
    }
}

/**
 * Handles the response, when a unique id has already been used.
 * 
 * @param response - The object used to send the response
 * @param uniqueIdPurpose - The name or description of what is being created
 * @param chosenValue - The value provided, which is already taken
 */
export const handleResourceAlreadyExistsError = (response: Response, uniqueIdPurpose: string, chosenValue?: string): void => {
    const message = `The ${uniqueIdPurpose} must be unique. ${chosenValue} is already taken.`;
    response.status(409).send(message);
}

/**
 * Handles the response, when a non-existant resource is being retrieved.
 * 
 * @param response - The object used to send the response
 * @param resourceName - The name or description of what is being created
 * @param chosenId - The id provided for a non-existant resource
 */
export const handleMissingRessourceError = (response: Response, resourceName: string, chosenId: string): void => {
    const message = `The ${resourceName} ${chosenId} does not exist.`;
    response.status(404).send(message);
}

/**
 * Handles the logging and response, when any server error occurs.
 * 
 * @param response - The object used to send the response
 * @param error - The error caught, or any information about the error to be logged
 */
export const handleGeneralError = (response: Response, error?: any): void => {
    handleGeneralErrorLogging(error);
    response.sendStatus(500);
}

/**
 * Handles the logging, when any server error occurs.
 */
export const handleGeneralErrorLogging = (error?: string): void => {
    const message = getGeneralErrorMessage(error);
    functions.logger.error(message);
}

const getGeneralErrorMessage = (error?: any) => (
    (error && error.code && error.message) ? (
        `${error.code} - ${error.message}`
    ) : (
            error && typeof error === 'string' ? (
                `Error: ${error}`
            ) : (
                    'Express executed custom error handler, with unknown error.'
                )
        )
)