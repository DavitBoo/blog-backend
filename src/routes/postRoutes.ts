import { RequestHandler, Router } from 'express';
import passport from 'passport';
import {
  createPost,
  getPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  getPostsBackEnd,
} from '../controllers/postController';
import { upload } from '../middlewares/multer';
import { cacheControl, revalidate, noStore } from '../middlewares/cacheControl';

const router = Router();
const jwtAuth = passport.authenticate('jwt', { session: false });

// Para rutas públicas que muestran más a quien tiene sesión: sin token sigue como anónimo, pero un
// token caducado da 401 para que el dashboard pueda avisar en vez de recibir un 404 engañoso
const optionalJwtAuth: RequestHandler = (req, res, next) =>
  req.headers.authorization ? jwtAuth(req, res, next) : next();

// Protect routes with Passport
router.get('/backend/', noStore, passport.authenticate('jwt', { session: false }), getPostsBackEnd); // This goes first in order to not tro 'backend' string as an id
router.get('/bySlug/:slug', cacheControl(60), getPostBySlug);
router.get('/', cacheControl(60), getPosts); // Public: Get all published posts
router.get('/:id', revalidate, optionalJwtAuth, getPostById); // Public, drafts require a session (dashboard)
router.post(
  '/',
  (req, res, next) => {
    console.log('Debug - Request headers:', req.headers);
    console.log('Debug - Request file:', req.file);
    console.log('Debug - Request body:', req.body);
    next();
  },
  upload.single('cover'),
  passport.authenticate('jwt', { session: false }),
  createPost,
);
router.patch(
  '/:id',
  upload.single('cover'),
  passport.authenticate('jwt', { session: false }),
  updatePost,
); // Protected: Update a post (requires authentication)
router.delete('/:id', passport.authenticate('jwt', { session: false }), deletePost); // Protected: Delete a post (requires authentication)

export default router;
