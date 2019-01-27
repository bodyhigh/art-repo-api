const { validationResult } = require('express-validator/check');
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';
import errorCodes from '../helpers/errorCodes'
import util from 'util';

exports.reqResultsHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        next(new APIError(errorCodes.INVALID_REQUEST_PARAMETERS.errorCode, 
            httpStatus.BAD_REQUEST, 
            true, 
            [errorCodes.INVALID_REQUEST_PARAMETERS, ...errors.array()]));
    } else {
        next();
    }
}