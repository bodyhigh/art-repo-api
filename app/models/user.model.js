import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Address from './address.model';
import ClientBasicRef from './clientRefs.model';
import ArtworkBasicRef  from './artworkRefs.model';
import util from 'util';

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, required: true, enum: ['admin', 'user'] }],
    clients: { type: [ClientBasicRef.schema] },
    clientRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
    artwork: { type: [ArtworkBasicRef.schema] },
    addresses: { type: [Address.schema] },
    accountStatus: { type: String, required: true, enum: ['active', 'disabled', 'registered'] },
    createDate: { type: Date, default: Date.now },
});

// Validation
UserSchema.path('roles').validate((roles) => {
    if (!roles) {
        return false;
    } else if (roles.length < 1) {
        return false;
    }

    return true;
}, 'required');

UserSchema.statics = {
    get(id) {
        return this.findById(id)
            .populate({ path: 'clientRefs' })
            .exec()
            .then((user) => {                
                if (user) return user;

                const err = new APIError('User Not Found.', httpStatus.NOT_FOUND);
				return Promise.reject(err);
            });
    },

    findByEmail(email) {
        return this.find({email})
            .exec()
            .then((user) => {
                // console.log(util.inspect(user, {colors: true }));
                if (user) {
                    if (user.length > 1) {
                        return Promise.reject(new APIError('Duplicate Records Found', httpStatus.BAD_REQUEST));
                    } else if (user.length === 1) {
                        return user[0];
                    }
                }

                return Promise.reject(new APIError('User Not Found', httpStatus.NOT_FOUND));
            });
    },

	/**
	 * [list description]
	 * @param  {Number} [skip=0]  [description]
	 * @param  {[type]} [limit=50 }  = {}] [description]
	 * @return {[type]} [description]
	 */
	list({ skip = 0, limit = 50 } = {}) {
		return this.find()
			.sort({ createDate: -1 })
			.skip(+skip)
			.limit(+limit)
			.exec();
	}
}

export default mongoose.model('User', UserSchema);