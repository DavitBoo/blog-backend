import { Router } from 'express';
import passport from 'passport';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/projectCategoryController';
import { cacheControl, revalidate } from '../middlewares/cacheControl';

const router = Router();

router.get('/', revalidate, getCategories); // Public, also used by the dashboard
router.get('/:id', cacheControl(300), getCategoryById); // Public
router.post('/', passport.authenticate('jwt', { session: false }), createCategory);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateCategory);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteCategory);

export default router;
