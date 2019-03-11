import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import util from 'util';
const { body } = require('express-validator/check');

exports.login = (req, res, next) => {
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    next();
}

exports.adminGuard = (req, res, next) => {
    // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%', util.inspect(req.identity, {colors: true}));
    if (req.identity === undefined || 
        !req.identity['roles'] || 
        req.identity.roles === undefined || 
        req.identity.roles.indexOf('admin') === -1) {
        next(new APIError(errorCodes.INVALID_ROLE_PERMISSIONS.description, 
			httpStatus.FORBIDDEN, 
			false, 
			[errorCodes.INVALID_ROLE_PERMISSIONS]));
    } else {
        next();
    }    
}

// function checkUserIsEnabled(req, res, next) {
//     // TODO: Placeholder logic for now, update later when we have account status
//     if (!req.identity['id'] || req.identity.id === undefined) {
//         res.status(401).json({ message: 'User account is disabled or does not exist' });
//     }

//     next();
// }

// export default { checkUserIsEnabled }