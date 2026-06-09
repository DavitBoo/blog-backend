import express from 'express';
import passport from 'passport';
import {
  createComment,
  getCommentsByPost,
  getAllComments,
  deleteComment,
  toggleApproveComment,
} from '../controllers/commentController';

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jwtAuth, getAllComments);
router.get('/:postId', getCommentsByPost);
router.post('/:postId', createComment);
router.delete('/:id', jwtAuth, deleteComment);
router.patch('/:id/approve', jwtAuth, toggleApproveComment);

export default router;
