import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

router.route('/')
    .get(userController.list);

router.route('/:id')
    .get(userController.get);

/**
 * Load user if id is a parameter
 */
router.param('id', userController.load);

export default router;