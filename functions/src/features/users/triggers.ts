import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as AppUtils from '../../app/utils';
import { Trigger } from "../types";
import { initialCustomClaims } from "./model";

/**
 * When a user object is created, place the initial custom claims.
 */
export const addUserInitialCustomClaims_TRIGGER: Trigger = functions.auth.user().onCreate((user: admin.auth.UserRecord) => {
    return admin.auth().setCustomUserClaims(user.uid, initialCustomClaims)
        .then(() => true)
        .catch(error => {
            AppUtils.handleGeneralErrorLogging(error);
        })
})
