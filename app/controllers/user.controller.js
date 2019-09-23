/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import User from '../models/user.model';
import APIError from '../helpers/APIError';

/**
 * Loads a single user record (by id) into req.user
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 * @param {string} id 
 */
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
}

/**
 * Returns a sigle user from req.user, dependent on load() to insert the user into the request body
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function get(req, res, next) {
	return res.json(req.user);
}

/**
 * Returns a list of users.  Additional parameters available from req.query { skip, limit }
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function list(req, res, next) {
	const { itemsPerPage, pageNumber } = req.query;
	User.list({ itemsPerPage, pageNumber })
		.then(users => res.json(users))
		.catch(e => next(e));
}

export default { load, get, list }