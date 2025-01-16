import express from 'express';
import passport from 'passport';
import { createPost, getPosts, getPostById, updatePost, deletePost, getPostsBackEnd } from '../controllers/postController';

const router = express.Router();

// Protect routes with Passport
router.get('/backend/', passport.authenticate('jwt', { session: false }), getPostsBackEnd); // This goes first in order to not tro 'backend' string as an id
router.get('/', getPosts); // Public: Get all published posts
router.get('/:id', getPostById); // Public: Get a single post by ID

router.post('/', passport.authenticate('jwt', { session: false }), createPost); // Protected: Create a new post (requires authentication)
router.patch('/:id', passport.authenticate('jwt', { session: false }), updatePost); // Protected: Update a post (requires authentication)
router.delete('/:id', passport.authenticate('jwt', { session: false }), deletePost); // Protected: Delete a post (requires authentication)

export default router;