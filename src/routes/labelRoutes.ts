import express from 'express';
import { createLabel, getAllLabels, getLabelById, updateLabel, deleteLabel } from '../controllers/labelController';

const router = express.Router();

router.post('/:postId', createLabel);
router.get('/', getAllLabels);


export default router;
