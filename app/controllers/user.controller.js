/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import User from '../models/user.model';
import APIError from '../helpers/APIError';
//import Encryption from './../helpers/encryption';

function load(req, res, next, id) {
	User.get(id)
		.then((user) => {
			req.user = user;
			return next();
		})
		.catch((e) => {
			//TODO: We should log e.message
			next(new APIError('User Not Found', httpStatus.NOT_FOUND));
		})
		// .catch(e => next(e));
}

function get(req, res, next) {
	return res.json(req.user);
}

function list(req, res, next) {
	const { skip = 0, limit = 50 } = req.query;
	User.list({ skip, limit })
		.then(users => res.json(users))
		.catch(e => next(e));
}

export default { load, get, list }