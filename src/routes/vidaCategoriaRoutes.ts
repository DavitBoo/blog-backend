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

const router = Router();

router.get('/backend', passport.authenticate('jwt', { session: false }), getCategoriasBackend);
router.get('/', getCategorias); // Public
router.get('/:id', getCategoriaById);

router.post('/', passport.authenticate('jwt', { session: false }), createCategoria);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateCategoria);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteCategoria);

export default router;
