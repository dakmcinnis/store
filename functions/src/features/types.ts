import * as functions from 'firebase-functions';

/**
 * A feature in express.
 * 
 * @member path: the pathname for the route
 * @member router: the express.Router() for the feature
 * @member isProtected: requires authentication, without considering user roles
 */
export interface Feature {
    path: string;
    router: any; // Left as 'any', since express does not export the 'Router' interface
    isProtected: boolean;
}

export type Trigger = functions.CloudFunction<any>;
