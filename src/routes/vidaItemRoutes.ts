import { Router } from 'express';
import passport from 'passport';
import {
  getItems,
  getItemsBackend,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/vidaItemController';
import { cacheControl, noStore } from '../middlewares/cacheControl';

const router = Router();

router.get('/backend', noStore, passport.authenticate('jwt', { session: false }), getItemsBackend);
router.get('/', cacheControl(60), getItems); // Public
router.get('/:id', noStore, passport.authenticate('jwt', { session: false }), getItemById);

router.post('/', passport.authenticate('jwt', { session: false }), createItem);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateItem);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteItem);

export default router;
