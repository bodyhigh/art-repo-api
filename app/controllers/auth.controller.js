import User from '../models/user.model';
import Encryption from '../helpers/encryption';
import jwtToken from '../helpers/jwtToken';

function login(req, res, next) {
	User.findByUsername(req.body.username)
		.then((user) => {            
			if (user !== undefined) {
				Encryption.compareStringsAsync(req.body.password, user.password)
					.then((matched) => {
						if (matched) {
							res.json({
								success: true,
								token: jwtToken.createToken(user),
								firstName: user.firstName,
								lastName: user.lastName,
                                userId: user.id,
                                roles: user.roles
							});
						} else {
							res.json({ success: false, message: 'Invalid login credentials' });
						}
					})
					.catch(e => next(e));
			} else {
				res.json({ success: false, message: 'Invalid login credentials' });
			}
		})
		.catch(e => next(e));
}

export default { login };
