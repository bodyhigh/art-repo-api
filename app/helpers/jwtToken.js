import jwt from 'jsonwebtoken';
import config from '../../config/config';

function createToken(user) {
	const payload = {
		id: user._id,
		// username: user.username,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
        roles: user.roles
	};

	return jwt.sign(payload, config.jwtSecret, { expiresIn: '3h' });
}

export default { createToken };
