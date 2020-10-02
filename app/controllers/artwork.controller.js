import Artwork from '../models/artwork.model';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import mongoErrorCodes from '../helpers/mongoErrorCodes';
import controllerHelper from '../helpers/controllerHelper';
import awsS3Helper from '../helpers/awsS3Helper';
// import fsHelper from '../helpers/fsHelper';
import fs from 'fs';
import util from 'util';

// Shortcut methods to controllerHelper functions
function escape(entity) {
    return controllerHelper.escapeEntity(entity, controllerHelper.artworkSanitizeFields);
}

function unescape(entity) {
    return controllerHelper.unescapeEntity(entity, controllerHelper.artworkSanitizeFields);
}

function unescapeArray(entities) {
    return controllerHelper.unescapeEntityArray(entities, controllerHelper.artworkSanitizeFields);
}

// Route Controller Methods
function post(req, res, next) {
    let artworkRecord = new Artwork({
        title: req.body.title,
        description: req.body.description,
        artistId: req.identity.id,
        createDate: Date.now(),
        dateCompleted: req.body.dateCompleted,
        medium: req.body.medium,
        dimension: {
            height: req.body.height,
            width: req.body.width,
            depth: req.body.depth,
            unit: req.body.unit
        }
    });

    const file = req.file;

    awsS3Helper.uploadImagesResized(req.identity.id, file)
        .then(data => {
            if (data) {
                // console.log(util.inspect(data, { colors: true}));
                artworkRecord.images = [{ 
                    hiRez: { url: data.hiRezData.Location, key: data.hiRezData.Key },
                    medRez: { url: data.medRezData.Location, key: data.medRezData.Key },
                    thumbnail: { url: data.thumbData.Location, key: data.thumbData.Key },
                    isPrimary: true }];
            }

            artworkRecord = escape(artworkRecord);        
            artworkRecord.save()
                .then((savedArtworkRecord) => res.json(unescape(savedArtworkRecord)))
                .catch((e) => {
                    // Duplicate Key Found
                    if (e.code === mongoErrorCodes.DUPLICATE_KEY_ERROR) {						
                        next(new APIError(e.errmsg, 
                            httpStatus.INTERNAL_SERVER_ERROR, 
                            true, 
                            [errorCodes.REGISTER_DUPLICATE_EMAIL]));
                    } else {
                        next(e);
                    }
                }); 
        }).catch((err) => next(new APIError(err)));
}

function listByArtistId(req, res, next) {
    // console.log(util.inspect(req.query, { colors: true }));
	const { itemsPerPage, pageNumber, sortFieldName, sortDirection, searchTerm } = req.query;
	const sort = {};
    sort[sortFieldName] = sortDirection === "asc" ? 1 : -1;

	let searchTermQuery = {};
	if (searchTerm) {
		searchTermQuery = { $or: ["title", "description"].map(field => {
			const item = {};
			item[field] = { $regex : new RegExp(searchTerm, "i")};
			return item;
		})};
    }

    searchTermQuery.artistId = req.identity.id;
    
    Artwork.listByArtistId({ itemsPerPage, pageNumber, sort, searchTermQuery })
        .then(result => {
            var resultJson = JSON.parse(result);
            resultJson.data = unescapeArray(resultJson.data);
            // console.log(util.inspect(resultJson, { colors: true }));
            res.json(resultJson);
        })
        .catch(e => next(e));
}

function findByArtistId(req, res, next) {
    Artwork.findByArtistId(req.identity.id)
        .then((result) => res.json(unescapeArray(result)))
        .catch((e) => next(e));
}

function findById(req, res, next) {
    const id = req.params.id;
    Artwork.get(id)
        .then((result) => {
            controllerHelper.validateEntityArtistIdOwnership(result, req);
            res.json(unescape(result));
        })
        .catch((e) => next(e));
}

function patch(req, res, next) {
    Artwork.findById(req.params.id)
        .then((originalRecord) => {
            controllerHelper.validateEntityArtistIdOwnership(originalRecord, req);
            originalRecord = escape(controllerHelper.patchMapping(originalRecord, req));
            originalRecord.save()
                .then((updatedRecord) => {
                    res.json(unescape(updatedRecord));
                });//.catch((e) => next(e));
        }).catch(e => next(e));
}

function deleteRecord(req, res, next) {
    awsS3Helper.deleteImagesFromUserFolder(req.body.artwork.images)
        .then(data => {
            Artwork.findByIdAndDelete(req.body.artwork.id)
                .then(() => {
                    res.json({success: true});
                }).catch(e => next(e));
        }).catch(e => next(e));
}

export default { 
    post, 
    listByArtistId,
    findByArtistId, 
    findById,
    patch,
    deleteRecord
};