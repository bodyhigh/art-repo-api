import Artwork from '../models/artwork.model';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import mongoErrorCodes from '../helpers/mongoErrorCodes';
import controllerHelper from '../helpers/controllerHelper';
import config from '../../config/config';
import fs from 'fs';
import AWS from 'aws-sdk';
import awsS3Helper from '../helpers/awsS3Helper';
import fsHelper from '../helpers/fsHelper';
// import uuid from 'uuid';
// import S3 from 'aws-sdk/clients/s3';
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

    //TODO: Need to only upload if an image was uploaded
    //TODO: Set some image validation: max size, type ...
    awsS3Helper.SetupUserFolder(req.identity.id).then((data) => {
        awsS3Helper.UploadToUserFolder(req.identity.id, req.file).then((data) => {
            fsHelper.fsUnlink(req.file.path).then(() => {
                console.log(`Temp File Deleted: ${req.file.path}`);

                let artworkRecord = new Artwork({
                    title: req.body.title,
                    description: req.body.description,
                    artistId: req.identity.id,
                    images: [{ url: data.Location, key: data.Key, isPrimary: true }]
                });
            
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
        }).catch((err) => next(new APIError(err)));
    }).catch((err) => next(new APIError(err)));

    // const tempFile = req.file;

    // fs.readFile(tempFile.path, (err, fileData) => {
    //     if (err) {
    //         console.log(err);
    //         next(new APIError(err));
    //     }

    //     const params = {Bucket: config.aws.s3BucketName, Key: tempFile.filename, Body: fileData, ACL: "public-read" };
    //     const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    //     const uploadPromise = s3.upload(params).promise();

    //     uploadPromise.then((data) => {
    //         console.log('UploadPromise Results');
    //         console.log(util.inspect(data, { colors: true}));
    //         fs.unlink(tempFile.path, (err) => {
    //             if (err) {
    //                 console.log(err);
    //                 next(new APIError(err));
    //             }
    //             console.log(`Temp File Deleted: ${tempFile.path}`)
    //         });

    //         // let artworkImage = new ArtworkImage({ url: data.Location, key: data.Key, isPrimary: true });

    //         let artworkRecord = new Artwork({
    //             title: req.body.title,
    //             description: req.body.description,
    //             artistId: req.identity.id,
    //             images: [{ url: data.Location, key: data.Key, isPrimary: true }]
    //         });
        
    //         artworkRecord = escape(artworkRecord);
    //         // console.log(util.inspect(artworkRecord, { colors: true }));
        
    //         artworkRecord.save()
    //             .then((savedArtworkRecord) => res.json(unescape(savedArtworkRecord)))
    //             .catch((e) => {
    //                 // Duplicate Key Found
    //                 if (e.code === mongoErrorCodes.DUPLICATE_KEY_ERROR) {						
    //                     next(new APIError(e.errmsg, 
    //                         httpStatus.INTERNAL_SERVER_ERROR, 
    //                         true, 
    //                         [errorCodes.REGISTER_DUPLICATE_EMAIL]));
    //                 } else {
    //                     next(e);
    //                 }
    //             });

    //     }).catch((err) => {
    //         console.log(err);
    //         next(new APIError(err));
    //     });
    // });
    
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
    Artwork.findByIdAndDelete(req.body.artwork.id)
        .then(result => {
            // res.sendStatus(200);
            res.json({success: true});
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