/* eslint-disable func-names */
// import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import Address from './address.model';
import { ArtworkBasicRef } from './artworkRefs.model';

const ClientSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	artistId: { type: mongoose.Schema.Types.ObjectId, required: true },
	// artwork: [{
	// 	artworkId: { type: mongoose.Schema.Types.ObjectId, required: true},
	// 	name: { type: String, required: true },
	// 	description: { type: String, required: true },
	// 	photoUrl: { type: String },
    // }],
    artwork: { type: [ArtworkBasicRef.Schema] },
    addresses: { type: [Address.schema] },
});

ClientSchema.index({ artistId: 1 });

ClientSchema.statics = {
    get(id) {
        return this.findById(id)
            .then((item) => {
                if (item) return item;

                const err = new APIError('Client Not Found.', httpStatus.NOT_FOUND);
				return Promise.reject(err);
            });
    }
};

export default mongoose.model('Client', ClientSchema);