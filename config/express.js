import config from './config';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import expressWinston from 'express-winston';
import winstonInstance from './winston';
import httpStatus from 'http-status';
import APIError from '../app/helpers/APIError';
import { hasinstanceOf } from '../app/helpers/typeHelper'; 
import util from 'util';

import routes from './../app/routes/';

const app = express();

if (config.env === 'development') {
	app.use(logger('dev'));
}

app.use(helmet());
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
    // winstonInstance.add(new expressWinston.transports.Console({
    //     format: expressWinston.format.simple()
    // }));

	expressWinston.requestWhitelist.push('body');
	expressWinston.responseWhitelist.push('body');
	app.use(expressWinston.logger({
		winstonInstance,
		meta: true, // optional: log meta data about request (defaults to true)
		msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
		colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
	}));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.use('/api', routes);

// ERROR HANDLING
// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {	
	if (err.name === 'UnauthorizedError') {
		// or use: code === 'credentials_required'
		res.status(401).send('invalid token');
	} else if (err.code === 'permission_denied') {
		res.status(401).send('permission denied');
	} else if (!hasinstanceOf(err, APIError)) {
		return next(new APIError(err.message, err.status, err.isPublic));
	}
	// console.log('########## ERROR HANDLING ##########')
	// console.log(util.inspect(err, { colors: true }));
	return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new APIError('API not found', httpStatus.NOT_FOUND);
	return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
	app.use(expressWinston.errorLogger({
		winstonInstance
	}));
}

// error handler, send stacktrace only during development
app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
	res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        errors: err.errors,
		stack: config.env === 'development' ? err.stack : {}
	})
);

export default app;