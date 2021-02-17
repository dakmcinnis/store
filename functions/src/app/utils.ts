import { Request, Response } from 'express';


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
