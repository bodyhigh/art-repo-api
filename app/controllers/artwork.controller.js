import Artwork from '../models/artwork.model';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import mongoErrorCodes from '../helpers/mongoErrorCodes';
import controllerHelper from '../helpers/controllerHelper';
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
        artistId: req.identity.id
    });

    artworkRecord = escape(artworkRecord);
    // console.log(util.inspect(artworkRecord, { colors: true }));

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

export default { 
    post, 
    findByArtistId, 
    findById,
    patch
};