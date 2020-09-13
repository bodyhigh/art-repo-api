/* eslint-disable func-names */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import util from 'util';

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
	createDate: { type: Date }
});

ArtworkSchema.index({ artistId: 1, type: -1 });

ArtworkSchema.statics = {
    get(id) {
		return this.findById(id)
			.then((item) => {
				if (item) {
					return item;
				}

				const err = new APIError('Artwork Item Not Found.', httpStatus.NOT_FOUND);
				return Promise.reject(err);
			});
	},

	listByArtistId({ itemsPerPage = 25, pageNumber = 0, sort = { createDate: -1 }, searchTermQuery = {} } = {}) {
		// console.log(util.inspect(searchTermQuery, { colors: true }));
		return this.find(searchTermQuery)
            .collation({ locale: "en" })
			.sort(sort)
			.skip(+itemsPerPage * +pageNumber)
			.limit(+itemsPerPage)
			.then(artwork => {
                if (artwork.length === 0) {
                    return JSON.stringify({ totalCount: 0, data: []});
                } else {
                    return this.countDocuments(searchTermQuery)
                        .then(totalCount => {
                            return JSON.stringify({ totalCount: totalCount, data: artwork});
                        });
                }
            });
	},
	
	findByArtistId(artistId) {
		return this.find({ artistId: artistId })
			.collation({ locale: "en" })
			.sort({ title: 1 })
			.exec()
			.then((artItems) => {
				if (artItems) {
					return artItems;
				}
				const err = new APIError('Artwork Items Not Found.', httpStatus.NOT_FOUND);
				return Promise.reject(err);
			});
	},
};

export default mongoose.model('Artwork', ArtworkSchema);