import { Router } from 'express';
import passport from 'passport';
import {
  getCategorias,
  getCategoriasBackend,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../controllers/vidaCategoriaController';
import { cacheControl, noStore } from '../middlewares/cacheControl';

const router = Router();

router.get(
  '/backend',
  noStore,
  passport.authenticate('jwt', { session: false }),
  getCategoriasBackend,
);
router.get('/', cacheControl(300), getCategorias); // Public
router.get('/:id', cacheControl(300), getCategoriaById); // Public

router.post('/', passport.authenticate('jwt', { session: false }), createCategoria);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateCategoria);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteCategoria);

export default router;
