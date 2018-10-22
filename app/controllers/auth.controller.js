import User from '../models/user.model';
import Encryption from '../helpers/encryption';
import jwtToken from '../helpers/jwtToken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import util from 'util';
import { doesNotReject } from 'assert';

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
					if (e.code === 11000) {
						res.json({
							success: false,
							errorCode: 'DUPLICATE_EMAIL',
							errmsg: e.errmsg
						});
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
						if (matched) {
							res.json({
								success: true,
								token: jwtToken.createToken(user),
								firstName: user.firstName,
								lastName: user.lastName,
                                userId: user.id,
                                roles: user.roles
							});
						} else {
							res.json({ 
								success: false, 
								errorCode: 'INVALID_CREDENTIALS', 
								message: 'Invalid login credentials' 
							});
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
				res.json({ 
					success: false, 
					errorCode: 'INVALID_CREDENTIALS', 
					message: 'Invalid login credentials' 
				});
			} else {
				// console.log(util.inspect(Object.keys(e), { colors: true }));
				next(e);
			}
		});
}

export default { register, login };
