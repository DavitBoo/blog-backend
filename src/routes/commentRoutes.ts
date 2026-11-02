import express from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import {
  createComment,
  getCommentsByPost,
  getAllComments,
  deleteComment,
  toggleApproveComment,
} from '../controllers/commentController';
import { revalidate, noStore } from '../middlewares/cacheControl';
import { optionalJwtAuth } from '../middlewares/optionalJwtAuth';

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false });

const createCommentLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Has enviado demasiados comentarios, espera unos minutos.' },
});

router.get('/', noStore, jwtAuth, getAllComments);
router.get('/:postId', revalidate, optionalJwtAuth, getCommentsByPost); // Public, emails require a session (dashboard)
router.post('/:postId', createCommentLimiter, createComment);
router.delete('/:id', jwtAuth, deleteComment);
router.patch('/:id/approve', jwtAuth, toggleApproveComment);

export default router;
