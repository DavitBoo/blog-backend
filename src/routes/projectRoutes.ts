import { Router } from 'express';
import passport from 'passport';
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
  getProjectsBackEnd,
} from '../controllers/projectController';
import { upload } from '../middlewares/multer';
import { cacheControl, revalidate, noStore } from '../middlewares/cacheControl';
import { optionalJwtAuth } from '../middlewares/optionalJwtAuth';

const router = Router();

router.get(
  '/backend/',
  noStore,
  passport.authenticate('jwt', { session: false }),
  getProjectsBackEnd,
);
router.get('/bySlug/:slug', cacheControl(60), getProjectBySlug);
router.get('/', cacheControl(60), getProjects); // Public
router.get('/:id', revalidate, optionalJwtAuth, getProjectById); // Public, drafts require a session (dashboard)

router.post(
  '/',
  upload.single('cover'),
  passport.authenticate('jwt', { session: false }),
  createProject,
);

router.patch(
  '/:id',
  upload.single('cover'),
  passport.authenticate('jwt', { session: false }),
  updateProject,
);

router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteProject);

export default router;
