import express from 'express';
import { reqResultsHandler } from '../middleware/requestValidation.middleware';
import { LoadAndValidateOwnership } from '../middleware/artwork.middleware';
import { checkMaxFileSize } from '../middleware/file.middleware';
import artworkController from '../controllers/artwork.controller';
import util from 'util';

const { check, body } = require('express-validator/check');
const router = express.Router();
const multer = require('multer');
const upload = multer({ 
    dest: './tmp/',
    limits: {
        fileSize: 1024 * 5000 // 5MB
    }
});

router.route('/')
    .post(upload.single('imageFile'), [
        body('title')
            .not().isEmpty()
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim(),
        body('description')
            .optional({ nullable: true, checkFalsy: true})
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim()
    ], reqResultsHandler, artworkController.post)

    .get(artworkController.listByArtistId);

router.route('/:id')
    .get(artworkController.findById)
    .delete(LoadAndValidateOwnership, artworkController.deleteRecord)
    .patch(upload.single('imageFile'), [
        body('title')
            .not().isEmpty()
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim(),
        body('description')
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim()
    ], reqResultsHandler, artworkController.patch);

export default router;