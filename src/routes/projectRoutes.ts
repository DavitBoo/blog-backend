import { Router } from 'express';
import passport from 'passport';
import {
  createProject,
  getProjects,
  getProjectById,
  getProjectBySlug,
  registerProjectView,
  updateProject,
  deleteProject,
  getProjectsBackEnd,
} from '../controllers/projectController';
import { uploadImageFile } from '../middlewares/multer';
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

router.post('/bySlug/:slug/view', registerProjectView); // Public

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  uploadImageFile('cover'),
  createProject,
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  uploadImageFile('cover'),
  updateProject,
);

router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteProject);

export default router;
