import config from './config';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import expressWinston from 'express-winston';
import winstonInstance from './winston';

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

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
	app.use(expressWinston.errorLogger({
		winstonInstance
	}));
}

export default app;