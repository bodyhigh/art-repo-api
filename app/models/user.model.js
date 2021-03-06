// import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Address from './address.model';
import ClientBasicRef from './clientRefs.model';
// import ArtworkBasicRef  from './artworkRefs.model';
import util from 'util';

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, required: true, enum: ['admin', 'user'] }],
    clients: { type: [ClientBasicRef.schema] },
    clientRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }],
    // artwork: { type: [ArtworkBasicRef.schema] },
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
            // .populate({ path: 'clientRefs' }) /* TODO: Not sure is this is required for returning client refs */
            .exec()
            .then((user) => {
                if (user) return user;

                const err = new APIError('User Not Found.', httpStatus.NOT_FOUND);
				return Promise.reject(err);
            });
    },

    /**
     * Find user account by email address
     *
     * @param {*} email
     * @returns
     */
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
     * This method will return a list of users that according to searchTermQuery values.
     * The result set is paged and includes the total result count.
     *
     * @param {*} [{ itemsPerPage = 25, pageNumber = 0, sort = { lastName: 1 }, searchTermQuery = {} }={}]
     * @returns
     */
    list({ itemsPerPage = 25, pageNumber = 0, sort = { lastName: 1 }, searchTermQuery = {} } = {}) {
        return this.find(searchTermQuery)
            .collation({ locale: "en" })
			.sort(sort)
			.skip(+itemsPerPage * +pageNumber)
			.limit(+itemsPerPage)
			.then(users => {
                if (users.length === 0) {
                    return JSON.stringify({ totalCount: 0, data: []});
                } else {
                    return this.countDocuments(searchTermQuery)
                        .then(totalCount => {
                            return JSON.stringify({ totalCount: totalCount, data: users});
                        });
                }
            });
    },

    // save(user) {
    //     return user.save();
    // }
    // updateUserProfile(userData)
};

export default mongoose.model('User', UserSchema);