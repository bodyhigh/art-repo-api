import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import util from 'util';
const { body } = require('express-validator/check');

// exports.login = (req, res, next) => {
//     // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
//     next();
// };

exports.adminGuard = (req, res, next) => {
    // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%', util.inspect(req.identity, {colors: true}));
    if (req.identity === undefined || 
        !req.identity['roles'] || 
        req.identity.roles === undefined || 
        req.identity.roles.indexOf('admin') === -1) {
        next(new APIError(errorCodes.INVALID_ROLE_PERMISSIONS.description, 
			httpStatus.FORBIDDEN, 
			true, 
			[errorCodes.INVALID_ROLE_PERMISSIONS]));
    } else {
        next();
    }    
}

// exports.sessionGuard = (req, res, next) => {
//     // TODO: Placeholder logic for now, update later when we have account status
//     if (!req.identity['id'] || req.identity.id === undefined) {
//         next(new APIError(errorCodes.CREDENTIALS_REQUIRED.description, 
//             httpStatus.UNAUTHORIZED, 
//             true,
//             [errorCodes.CREDENTIALS_REQUIRED]));
//     }

//     next();
// }
