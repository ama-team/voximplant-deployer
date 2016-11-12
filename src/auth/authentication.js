/**
 * This module should be substituted with it's replica in @ama-team/voximplant-api as soon as it's ready [todo]
 *
 * @module auth/authentication
 */
const ACCOUNT_IDENTIFICATION_KEYS = [
    'accountId',
    'accountName',
    'accountEmail'
];

const ADMIN_IDENTIFICATION_KEYS = [
    'adminId',
    'adminName'
];

const IDENTITY_VALIDATION_KEYS = [
    'apiKey',
    'password',
    'sessionId',
];

const AUTHENTICATION_KEYS = Array.prototype.concat.call(
    [],
    ACCOUNT_IDENTIFICATION_KEYS,
    ADMIN_IDENTIFICATION_KEYS,
    IDENTITY_VALIDATION_KEYS
);

/**
 * @class
 */
class Authentication {

    /**
     * @param {object} raw Unvalidated authentication object
     * @param {string} raw.accountId Account id, maps to `account_id` VI API query parameter
     * @param {string} raw.accountName Account name, maps to `account_name` VI API query parameter
     * @param {string} raw.accountEmail Account email, maps to `account_email` VI API query parameter
     * @param {string} raw.adminId Admin id, maps to `admin_user_id` VI API query parameter
     * @param {string} raw.adminName Admin user name, maps to `admin_user_name` VI API query parameter
     * @param {string} raw.apiKey API key, maps to `api_key` or `admin_user_api_key` VI API query parameter (depending on
     *   admin identification parameter presence)
     * @param {string} raw.password password Password, maps to `account_password` or `admin_user_password` VI
     *   API query parameter (depending on admin identification parameter presence)
     * @param {string} raw.sessionId Existing VI session ID, maps to `session_id` VI API query parameter.
     */
    constructor(raw) {
        Object.defineProperty(this, 'version', { enumerable: true, writable: false, value: 1 });
        Object.defineProperty(this, 'type', {
            enumerable: true,
            get: () => this.adminId || this.adminName ? 'admin' : 'account'
        });
        AUTHENTICATION_KEYS.forEach(key => {
            if (raw[key]) {
                this[key] = raw[key];
            }
        });
    }

    validate() {
        let accountIdentificationKeys = ACCOUNT_IDENTIFICATION_KEYS.filter(key => this[key]),
            adminIdentificationKeys = ADMIN_IDENTIFICATION_KEYS.filter(key => this[key]),
            identityValidationKeys = IDENTITY_VALIDATION_KEYS.filter(key => this[key]),
            violations = [],
            valid = true;

        if (accountIdentificationKeys.length == 0) {
            valid = false;
            violations.push('Account identification key hasn\'t been provided, acceptable keys: ' +
                ACCOUNT_IDENTIFICATION_KEYS);
        } else if (accountIdentificationKeys.length != 1) {
            violations.push('Multiple account identification keys provided: ' + accountIdentificationKeys);
        }
        if (adminIdentificationKeys.length != 0) {
            if (identityValidationKeys.length == 1 && identityValidationKeys[0] === 'sessionId') {
                valid = false;
                violations.push('sessionId key could not be used for admin authentication');
            }
            if (adminIdentificationKeys.length != 1) {
                violations.push('Multiple admin identification keys provided: ' + adminIdentificationKeys);
            }
        }
        if (identityValidationKeys.length == 0) {
            valid = false;
            violations.push('Identity validation key hasn\'t been provided, acceptable keys: ' +
                IDENTITY_VALIDATION_KEYS);
        } else if (identityValidationKeys.length != 1) {
            violations.push('Multiple identity validation keys provided: ' + identityValidationKeys);
        }
        return {
            valid,
            violations
        }
    }

    serialize() {
        let result = {};
        AUTHENTICATION_KEYS.forEach(key => {
            if (this[key]) {
                result[key] = this[key];
            }
        });
        result.version = this.version;
        return result;
    }
}

export default Authentication;