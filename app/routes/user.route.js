import express from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';
import { reqResultsHandler } from '../middleware/requestValidation.middleware';

const { check, body } = require('express-validator/check');
const router = express.Router();

router.route('/')
    .get(authMiddleware.adminGuard, userController.list);

router.route('/:id')
    .get(authMiddleware.adminGuard, userController.get);

router.route('/userProfile/:id')
    .patch([
        body('firstName')
            .not().isEmpty()
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim()
            .escape(),
        body('lastName')
            .not().isEmpty()
            .isLength({ min: 3 }).withMessage('must be at least 3 chars long')
            .trim()
            .escape(),
        body('email')
            .not().isEmpty()
            .isEmail()
            .trim()
            .normalizeEmail(),
        body('accountStatus')
            .not().isEmpty()
            .isString()
            .trim()
            .escape()
    ], authMiddleware.adminGuard, reqResultsHandler, userController.patch);

/**
 * Load user if id is a parameter
 */
router.param('id', userController.load);

export default router;