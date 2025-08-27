import { Router } from "express";
import rateLimit from 'express-rate-limit';
import { getTech } from '../controllers/techController';


const router = Router();    



const limiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get(['/tech', '/.well-known/stack'], limiter, getTech);

export default router;