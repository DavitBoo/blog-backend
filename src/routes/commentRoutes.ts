import express from 'express';
import passport from 'passport';
import {
  createComment,
  getCommentsByPost,
  getAllComments,
  deleteComment,
  toggleApproveComment,
} from '../controllers/commentController';
import { revalidate, noStore } from '../middlewares/cacheControl';

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', noStore, jwtAuth, getAllComments);
router.get('/:postId', revalidate, getCommentsByPost); // Public, also used by the dashboard
router.post('/:postId', createComment);
router.delete('/:id', jwtAuth, deleteComment);
router.patch('/:id/approve', jwtAuth, toggleApproveComment);

export default router;
