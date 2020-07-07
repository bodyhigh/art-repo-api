/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import User from '../models/user.model';
import APIError from '../helpers/APIError';
import util from 'util';

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
	// console.log(util.inspect(req.identity, { colors: true }));
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
	}

	User.list({ itemsPerPage, pageNumber, sort, searchTermQuery })
		.then(users => res.json(users))
		.catch(e => next(e));
}

function patch(req, res, next) {
	const keys = Object.keys(req.body);

	for (let i = 0; i < keys.length; i++) {
		if (keys[i] == 'id') continue; // Don't update the id
		if (req.body[keys[i]] === req.user[keys[i]]) continue;  // primitive checking for updated value
		
		req.user[keys[i]] = req.body[keys[i]];
	}
	
	req.user.save()
		.then((foo) => {
			res.json(foo);
		})
		.catch((e) => next(d));
}

export default { load, get, list, patch };