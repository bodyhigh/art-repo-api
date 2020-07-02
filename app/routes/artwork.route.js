import express from 'express';
import { reqResultsHandler } from '../middleware/requestValidation.middleware';
import artworkController from '../controllers/artwork.controller';

const { check, body } = require('express-validator/check');
const router = express.Router();

router.route('/')
    .post([
        body('title')
            .not().isEmpty()
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim()
            .escape(),
    ], reqResultsHandler, artworkController.post)

    //TODO: make sure identity is set
    .get(artworkController.GetAllByArtistId);

router.route('/:id')
    .get(artworkController.GetById);

export default router;