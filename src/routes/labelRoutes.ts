import express from 'express';
import { createLabel, getAllLabels, getLabelById, updateLabel, deleteLabel } from '../controllers/labelController';
import passport from 'passport';

const router = express.Router();

router.post('/:postId', createLabel);
router.post('/', passport.authenticate('jwt', { session: false }), createLabel);
router.get('/', getAllLabels);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteLabel);
router.put('/:id', passport.authenticate('jwt', { session: false }), updateLabel);

export default router;
