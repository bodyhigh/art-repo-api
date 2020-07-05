import express from 'express';
import { reqResultsHandler } from '../middleware/requestValidation.middleware';
import artworkController from '../controllers/artwork.controller';
import util from 'util';

const { check, body } = require('express-validator/check');
const router = express.Router();

router.route('/')
    .post([
        body('title')
            .not().isEmpty()
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim(),
        body('description')
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim()
    ], reqResultsHandler, artworkController.post)

    .get(artworkController.findByArtistId);

router.route('/:id')
    .get(artworkController.findById)
    .patch([
        body('title')
            .not().isEmpty()
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim(),
        body('description')
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim()
    ], reqResultsHandler, artworkController.patch);

export default router;