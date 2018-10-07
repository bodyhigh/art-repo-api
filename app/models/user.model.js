import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Address from './address.model';
import ClientBasicRef from './clientRefs.model';
import ArtworkBasicRef  from './artworkRefs.model';

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, required: true, enum: ['admin', 'user'] }],
    // roles: { type: [String], required: true, enum: ['admin', 'user']},
    clients: { type: [ClientBasicRef.schema] },
    clientRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
    artwork: { type: [ArtworkBasicRef.schema] },
    addresses: { type: [Address.schema] },
    accountStatus: { type: String, required: true, enum: ['active', 'disabled'] },
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
                if (user) {
                    if (user.length > 1) {
                        return Promise.reject(new APIError('Duplicate Records Found', httpStatus.BAD_REQUEST));
                    }

                    return user[0];
                }

                return Promise.reject(new APIError('User Not Found', httpStatus.NOT_FOUND));
            });
    }
}

export default mongoose.model('User', UserSchema);

// firstName,
// lastName,
// email,
// password,
// roles,
// activationStatus,
// createdDate,
// clients: {
//     id,
//     firstName,
//     lastName
// },
// artwork: {
//     id,
//     name,
//     description,
//     photoUrl
// }