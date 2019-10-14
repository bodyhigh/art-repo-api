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
		});
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
 * Returns a list of users.  Additional parameters available from req.query { itemsPerPage, 
 * pageNumber, sortFieldName, sortDirection, searchTerm }
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 */
function list(req, res, next) {
	const { itemsPerPage, pageNumber, sortFieldName, sortDirection, searchTerm } = req.query;
	const sort = {};
	sort[sortFieldName] = sortDirection === "asc" ? 1 : -1;

	let searchTermQuery = {};
	if (searchTerm) {
		// Option 1
		searchTermQuery = { $or: ["firstName", "lastName", "email", "accountStatus"].map(field => {
			const item = {};
			item[field] = { $regex : new RegExp(searchTerm, "i")};
			return item;
		})};
		
		// // Option 2
		// const searchTermRegEx = { $regex : new RegExp(searchTerm, "i")};
		// searchTermQuery = { $or: [
		// 	{ firstName: searchTermRegEx },
		// 	{ lastName: searchTermRegEx },
		// 	{ email: searchTermRegEx },
		// 	{ accountStatus: searchTermRegEx }
		// ]};
	}

	User.list({ itemsPerPage, pageNumber, sort, searchTermQuery })
		.then(users => res.json(users))
		.catch(e => next(e));
}

export default { load, get, list };