import Artwork from '../models/artwork.model';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import mongoErrorCodes from '../helpers/mongoErrorCodes';
import util from 'util';


function post(req, res, next) {
    const artworkRecord = new Artwork({
        title: req.body.title,
        description: req.body.description,
        artistId: req.identity.id
    });

    artworkRecord.save()
        .then((savedArtworkRecord) => res.json(savedArtworkRecord))
        .catch((e) => {
            // console.log(util.inspect(e, { colors: true }));
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

function GetAllByArtistId(req, res, next) {
    Artwork.GetAllByArtistId(req.identity.id)
        .then((result) => res.json(result))
        .catch(e => next(e));
}

function GetById(req, res, next) {
    const id = req.params.id;
    // console.log(util.inspect(req.params, { colors: true }));
    // console.log(`!!!!!!!!!!!!!!!!!!!!!!!! ID: ${id}`);
    Artwork.get(id)
        .then((result) => res.json(result))
        .catch(e => next(e));
}

export default { post, GetAllByArtistId, GetById };