import express from 'express';
import expressJwt from 'express-jwt';
import unless from 'express-unless';
import config from '../../config/config';
// import authRoutes from './auth.route';
// import userRoutes from './user.route';
// import artRoutes from './art.route';

const router = express.Router();

// Paths that do not req JWT validation
const unlessPaths = ['/api/auth/login', '/api/health-check'];

router.use(
	expressJwt({ secret: config.jwtSecret, requestProperty: 'identity' })
		.unless({ path: unlessPaths })
);

router.get('/health-check', (req, res) => {
	res.send('OK');
});

// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/art', artRoutes);

export default router;
