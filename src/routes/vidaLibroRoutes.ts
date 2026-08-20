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
import { cacheControl, revalidate, noStore } from '../middlewares/cacheControl';

const router = Router();

// Rutas estáticas primero: nunca deben caer en el ":id" dinámico de abajo
router.get('/backend', noStore, passport.authenticate('jwt', { session: false }), getLibrosBackend);
router.get('/preview', cacheControl(60), getLibrosPreview); // Public
router.get('/resumen', revalidate, getLecturasResumen); // Public, also used by the dashboard
router.patch('/resumen', passport.authenticate('jwt', { session: false }), updateLecturasResumen);

router.get('/', cacheControl(60), getLibros); // Public
router.get('/:id', noStore, passport.authenticate('jwt', { session: false }), getLibroById);

router.post('/', passport.authenticate('jwt', { session: false }), createLibro);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateLibro);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteLibro);

export default router;
