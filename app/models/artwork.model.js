/* eslint-disable func-names */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const ArtworkImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    key: { type: String, required: true },
    isPrimary: Boolean
});

const ArtworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    artistId: { type: mongoose.Types.ObjectId, required: true },
    dateCompleted: { type: Date },
    inventoryNumber: { type: String },
    medium: { type: String },
    status: { type: String },
	images: { type: [ArtworkImageSchema]},
	dimension: {
        height: { type: Number, required: false },
        width: { type: Number, required: false },
        depth: { type: Number, required: false },
        unit: { type: String, required: false }
    },
});

ArtworkSchema.index({ artistId: 1, type: -1 });

ArtworkSchema.statics = {
    get(id) {
		return this.findById(id)
			.then((item) => {
				if (item) {
					return item;
				}

				const err = new APIError('Art Item Not Found.', httpStatus.NOT_FOUND);
				return Promise.reject(err);
			});
	},

	findByArtistId(artistId) {
		return this.find({ artistId })
			.exec()
			.then((artItems) => {
				if (artItems) {
					return artItems;
				}

				const err = new APIError('Art Items Not Found.', httpStatus.NOT_FOUND);
				return Promise.reject(err);
			});
	},

	GetAllByArtistId(artistId) {
		return this.find({ artistId })
			.collation({ locale: "en" })
			.sort({ title: 1 })
			.then((results) => {
				return results;
			});
			
	},

	listByArtistId({ artistId = 0, page = 0, limit = 20 } = {}) {
		const skip = +page * +limit;

		return this.find({ artistId })
			.sort({ title: 1 })
			.skip(+skip)
			.limit(+limit)
			.exec();
	}
};

export default mongoose.model('Artwork', ArtworkSchema);