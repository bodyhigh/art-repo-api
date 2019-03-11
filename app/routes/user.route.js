import express from 'express';
import userController from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
    .get(authMiddleware.adminGuard, userController.list);

router.route('/:id')
    .get(authMiddleware.adminGuard, userController.get);

/**
 * Load user if id is a parameter
 */
router.param('id', userController.load);

export default router;