import Artwork from '../models/artwork.model';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import mongoErrorCodes from '../helpers/mongoErrorCodes';
import util from 'util';


function post(req, res, next) {
    const artworkRecord = new Artwork({
        name: req.body.name,
        description: req.body.description,
        artistId: req.body.artistId
    });
    // console.log(util.inspect(req.identity, { colors: true }));

    artworkRecord.save()
        .then((savedArtworkRecord) => res.json(savedArtworkRecord))
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

export default { post };