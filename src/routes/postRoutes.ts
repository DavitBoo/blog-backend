import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', getPosts); // Public: Get all published posts
router.get('/:id', getPostById); // Public: Get a single post by ID
router.post('/', authenticate, createPost); // Protected: Create a new post (authors only)
router.put('/:id', authenticate, updatePost); // Protected: Update a post (authors only)
router.delete('/:id', authenticate, deletePost); // Protected: Delete a post (authors only)

export default router;