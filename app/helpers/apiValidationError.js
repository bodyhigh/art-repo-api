// import ExtendableError from './extendableError';
// import httpStatus from 'http-status';

// /**
//  * Class representing an API error.
//  * @extends ExtendableError
//  */
// class APIValidationError extends ExtendableError {
// 	/**
// 	 * Creates an API error.
// 	 * @param {string} message - Error message.
// 	 * @param {number} status - HTTP status code of error.
// 	 * @param {boolean} isPublic - Whether the message should be visible to user or not.
// 	 */
// 	constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
// 		super(message, status, isPublic);
// 	}
// }

// export default APIError;

class FieldValidationError {
    constructor(field, errorMessage) {
        this.field = field;
        this.errorMessage = errorMessage;
    }
}

export default FieldValidationError;