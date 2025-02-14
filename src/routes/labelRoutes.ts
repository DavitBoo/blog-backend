import express from 'express';
import { createLabel, getAllLabels, getLabelById, updateLabel, deleteLabel } from '../controllers/labelController';
import passport from 'passport';

const router = express.Router();

router.post('/:postId', createLabel);
router.get('/', getAllLabels);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteLabel);

export default router;
