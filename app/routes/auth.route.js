import express from 'express';
import { reqResultsHandler } from '../middleware/requestValidation.middleware';
import authController from '../controllers/auth.controller';

const { check, body } = require('express-validator/check');
const router = express.Router();

router.route('/register')
    .post([
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
        body('password')
            .not().isEmpty()
            .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
            // Need some custom validator here
            .trim(),
        body('passwordConfirm')
            .not().isEmpty()
            .isLength({ min: 8 }).withMessage('must be at least 8 chars long')
            // Need some custom validator here
            .trim()
    ], reqResultsHandler, authController.register);

router.route('/login')
    .post([
        check('email').isEmail(),
        check('password', 'minimum password length is 8 characters').isLength({ min: 8 })
    ], reqResultsHandler, authController.login);

export default router;