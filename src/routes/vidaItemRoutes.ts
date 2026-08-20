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

const router = Router();

router.get('/backend', passport.authenticate('jwt', { session: false }), getItemsBackend);
router.get('/', getItems); // Public
router.get('/:id', passport.authenticate('jwt', { session: false }), getItemById);

router.post('/', passport.authenticate('jwt', { session: false }), createItem);
router.patch('/:id', passport.authenticate('jwt', { session: false }), updateItem);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteItem);

export default router;
