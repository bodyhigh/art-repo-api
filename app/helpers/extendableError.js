/**
 * @extends Error
 */
class ExtendableError extends Error {
	constructor(message, status, isPublic) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = status;
		this.isPublic = isPublic;
        this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
        this.hasInstanceOf = ['ExtendedError', 'Error'];
		Error.captureStackTrace(this, this.constructor.name);
	}
}

export default ExtendableError;