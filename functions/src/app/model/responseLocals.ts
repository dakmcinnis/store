import * as admin from 'firebase-admin';
import { CustomClaims } from '../../features/users/model';
import { PathIncludingDocumentId } from './path';

/**
 * The structure of how we populate response.locals (provided by Express).
 */
export type ResponseLocals = Partial<ResponseLocalsComplete>;

/**
 * The structure of how we populate response.locals (provided by Express), after authentication is performed.
 * 
 * At this point, the userInfo is in our response.locals
 */
export type ResponseLocalsAuthenticated = ResponseLocalsUserInfo & ResponseLocals;

export type ResponseLocalsComplete = ResponseLocalsUserInfo & ResponseLocalsDocumentData;

interface ResponseLocalsUserInfo {
    userInfo: UserInfo;
}

interface ResponseLocalsDocumentData {
    documentData: {
        [path in PathIncludingDocumentId]: admin.firestore.DocumentData;
    }
}

/**
 * The user information we will make accessible from response.locals (provided by Express).
 */
export interface UserInfo extends CustomClaims {
    uid: string;
    email: string;
    displayName: string;
}