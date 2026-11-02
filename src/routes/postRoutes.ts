import { Router } from 'express';
import passport from 'passport';
import {
  createPost,
  getPosts,
  getRandomPost,
  getPostById,
  getPostBySlug,
  registerPostView,
  updatePost,
  deletePost,
  getPostsBackEnd,
} from '../controllers/postController';
import { uploadImageFile } from '../middlewares/multer';
import { cacheControl, revalidate, noStore } from '../middlewares/cacheControl';
import { optionalJwtAuth } from '../middlewares/optionalJwtAuth';

const router = Router();

// Protect routes with Passport
router.get('/backend/', noStore, passport.authenticate('jwt', { session: false }), getPostsBackEnd); // This goes first in order to not tro 'backend' string as an id
router.get('/random', noStore, getRandomPost); // Public, goes before ':id' like 'backend'
router.get('/bySlug/:slug', cacheControl(60), getPostBySlug);
router.get('/', cacheControl(60), getPosts); // Public: Get all published posts
router.get('/:id', revalidate, optionalJwtAuth, getPostById); // Public, drafts require a session (dashboard)
router.post('/bySlug/:slug/view', registerPostView); // Public
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  uploadImageFile('cover'),
  createPost,
);
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  uploadImageFile('cover'),
  updatePost,
); // Protected: Update a post (requires authentication)
router.delete('/:id', passport.authenticate('jwt', { session: false }), deletePost); // Protected: Delete a post (requires authentication)

export default router;
