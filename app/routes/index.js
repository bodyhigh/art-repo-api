import express from 'express';
import expressJwt from 'express-jwt';
import unless from 'express-unless';
import config from '../../config/config';
// import { reqResultsHandler } from '../middleware/requestValidation.middleware';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import authMiddleware from '../middleware/auth.middleware';
import util from 'util';

import authRoutes from './auth.route';
import userRoutes from './user.route';
import artworkRoutes from './artwork.route';

const router = express.Router();

// Paths that do not req JWT validation
const unlessPaths = ['/api/auth/login', 
    '/api/auth/register', 
	'/api/health-check'
];

router.use(
	expressJwt({ secret: config.jwtSecret, requestProperty: 'identity', algorithms: ['HS256'] })
		.unless({ path: unlessPaths })	
);

// Handle token errors here
router.use((err, req, res, next) => {
	// console.log(util.inspect(err, { colors: true}));
	if (err.name === 'UnauthorizedError') {
		next(new APIError(err.message, 
			httpStatus.UNAUTHORIZED, 
			false, 
			[errorCodes.CREDENTIALS_REQUIRED]));
	} else if (err)	{
		next(err);
	} else {
		next();
	}
});

router.get('/health-check', (req, res) => {
	const payload = {
		STATUS: 'OK',
		NODE_ENV: config.env
	};
	res.json(payload);
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/artwork', artworkRoutes);

export default router;
