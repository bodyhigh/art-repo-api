import User from '../models/user.model';
import Encryption from '../helpers/encryption';
import jwtToken from '../helpers/jwtToken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import mongoErrorCodes from '../helpers/mongoErrorCodes';
import util from 'util';

function register(req, res, next) {
	Encryption.hashStringAsync(req.body.password)
		.then((hashedPassword) => {
			const newUser = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: hashedPassword,
				roles: ['user'],
				accountStatus: 'registered'
			});

			newUser.save()
				.then((savedUser) => res.json(savedUser))
				.catch((e) => {
					// Duplicate Key Found
					if (e.code === mongoErrorCodes.DUPLICATE_KEY_ERROR) {						
						next(new APIError(e.errmsg, 
                            httpStatus.INTERNAL_SERVER_ERROR, 
                            true, 
                            [errorCodes.REGISTER_DUPLICATE_EMAIL]));
					} else {
						next(e);
					}
				});
		})
		.catch(e => next(e));
}

function login(req, res, next) {	
	User.findByEmail(req.body.email)
	.then((user) => {    		 
		if (user !== undefined) {
			Encryption.compareStringsAsync(req.body.password, user.password)
				.then((matched) => {
					if (matched && (user.accountStatus === 'active')) {
						res.json({
							success: true,
							token: jwtToken.createToken(user),
							firstName: user.firstName,
							lastName: user.lastName,
							userId: user.id,
							roles: user.roles
						});
					} else {
						next(new APIError(errorCodes.INVALID_CREDENTIALS.description, 
                            httpStatus.INTERNAL_SERVER_ERROR, 
                            true, 
                            [errorCodes.INVALID_CREDENTIALS]));
					}
				})
				.catch(e => next(e));
		} else {
			next(new APIError('Error in method findByEmail()', httpStatus.INTERNAL_SERVER_ERROR));
		}
	})
	.catch((e) => {
		// User Not Found
		if (e.status === httpStatus.NOT_FOUND) {
			next(new APIError(errorCodes.INVALID_CREDENTIALS.description, 
				httpStatus.INTERNAL_SERVER_ERROR, 
				true, 
				[errorCodes.INVALID_CREDENTIALS]));
		} else {
			// console.log(util.inspect(Object.keys(e), { colors: true }));
			next(e);
		}
	});
}

export default { register, login };
