import { Router } from 'express';
import passport from 'passport';
import { getTags, createTag, updateTag, deleteTag } from '../controllers/vidaTagController';

const router = Router();

router.get('/', getTags); // Public
router.post('/', passport.authenticate('jwt', { session: false }), createTag);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateTag);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteTag);

export default router;
