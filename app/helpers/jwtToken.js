import jwt from 'jsonwebtoken';
import config from '../../config/config';
import util from 'util';

function createToken(user) {
	const payload = {
		id: user._id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
        roles: user.roles
	};

	return jwt.sign(payload, config.jwtSecret, { expiresIn: '3h' });
}

export default { createToken };
