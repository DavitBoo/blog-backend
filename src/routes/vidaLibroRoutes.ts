import { Router } from 'express';
import passport from 'passport';
import {
  getLibros,
  getLibrosBackend,
  getLibrosPreview,
  getLecturasResumen,
  updateLecturasResumen,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibro,
} from '../controllers/vidaLibroController';

const router = Router();

// Rutas estáticas primero: nunca deben caer en el ":id" dinámico de abajo
router.get('/backend', passport.authenticate('jwt', { session: false }), getLibrosBackend);
router.get('/preview', getLibrosPreview); // Public
router.get('/resumen', getLecturasResumen);
router.patch('/resumen', passport.authenticate('jwt', { session: false }), updateLecturasResumen);

router.get('/', getLibros); // Public
router.get('/:id', passport.authenticate('jwt', { session: false }), getLibroById);

router.post('/', passport.authenticate('jwt', { session: false }), createLibro);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateLibro);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteLibro);

export default router;
