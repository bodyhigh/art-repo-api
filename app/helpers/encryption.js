import Promise from 'bluebird';
const bcrypt = Promise.promisifyAll(require('bcrypt'));
import config from '../../config/config';

function hashStringAsync(unhashedString) {
	if (!unhashedString) {return Promise.reject('String parameter not provided');}

	return bcrypt.hash(unhashedString, config.encryptionSaltRounds);
}

function compareStringsAsync(unhashedString, hash) {    
	return bcrypt.compare(unhashedString, hash);
}

export default { hashStringAsync, compareStringsAsync };
