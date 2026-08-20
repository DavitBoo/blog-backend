import express from 'express';
import { createLabel, getAllLabels, getLabelById, updateLabel, deleteLabel } from '../controllers/labelController';
import passport from 'passport';
import { revalidate } from '../middlewares/cacheControl';

const router = express.Router();

router.post('/:postId', createLabel);
router.post('/', passport.authenticate('jwt', { session: false }), createLabel);
router.get('/', revalidate, getAllLabels); // Public, also used by the dashboard
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteLabel);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateLabel);

export default router;
