import Artwork from '../models/artwork.model';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import errorCodes from '../helpers/errorCodes';
import util from 'util';

/**
 * Loads the requested artwork item into [req.body.artwork] and validates
 * the current user has ownership of the record.
 *
 * @export
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function LoadAndValidateOwnership(req, res, next) {
    const artworkId = req.params.id;
    const artistId = req.identity.id;

    Artwork.get(artworkId)
        .then(
            (artwork) => {
                if (artwork.artistId == artistId) {
                    // console.log(util.inspect(artwork, { colors: true}));
                    req.body.artwork = artwork;
                    next();
                } else {
                    next(new APIError(errorCodes.INVALID_OWNERSHIP.description, 
                        httpStatus.UNAUTHORIZED,
                        true,
                        [errorCodes.INVALID_OWNERSHIP]));
                }
                
            },
            (err) => {
                // console.log(util.inspect(err, { colors: true}));
                next(err);
            }
        );
}