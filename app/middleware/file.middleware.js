import util from 'util';
import APIError from '../helpers/APIError';
import httpStatus from 'http-status';

export function checkMaxFileSize(req, res, next) {
    if (!req.file && !req.files) next(); // No files to check

    const MAX_FILE_SIZE = 5000000; // 5MB

    if (req.file) {
        // console.log(util.inspect(req.file));
        if (req.file.size > MAX_FILE_SIZE) {
            console.error('MAX_FILE_SIZE_EXCEEDED');
            next(new APIError(`MAX_FILE_SIZE_EXCEEDED: ${MAX_FILE_SIZE}`, httpStatus.BAD_REQUEST, true));
        } else {
            next();
        }
    } else if (req.files) {
        next(new APIError('[checkMaxFileSize] NOT IMPLEMENTED YET for files'));
    }
}