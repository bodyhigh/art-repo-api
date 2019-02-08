//@ts-check
import ExtendableError from './extendableError';
import httpStatus from 'http-status';

/**
 *
 *
 * @class APIError
 * @extends {ExtendableError}
 */
class APIError extends ExtendableError {
	/**
	 *Creates an instance of APIError.
	 * @param {string} message - Error message
	 * @param {number} [status=httpStatus.INTERNAL_SERVER_ERROR] - HTTP status code of the error
	 * @param {boolean} [isPublic=false] - Is the error publically visible
	 * @param {array} [errors=[]] - List of errors
	 * @memberof APIError
	 */
	constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false, errors = []) {
        super(message, status, isPublic);
        this.errors = errors;
        this.hasInstanceOf.push('APIError');
    }
}

export default APIError;