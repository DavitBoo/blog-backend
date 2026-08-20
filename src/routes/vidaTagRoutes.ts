import { Router } from 'express';
import passport from 'passport';
import { getTags, createTag, updateTag, deleteTag } from '../controllers/vidaTagController';
import { revalidate } from '../middlewares/cacheControl';

const router = Router();

router.get('/', revalidate, getTags); // Public, also used by the dashboard
router.post('/', passport.authenticate('jwt', { session: false }), createTag);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateTag);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteTag);

export default router;
