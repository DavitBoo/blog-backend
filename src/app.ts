import express from 'express';
import passport from './config/passport';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import labelRoutes from './routes/labelRoutes';
import techRoutes from './routes/techRoutes';
import mediaRoutes from './routes/mediaRoutes';
import projectRoutes from './routes/projectRoutes';
import projectCategoryRoutes from './routes/projectCategoryRoutes';

const app = express();

app.use(helmet());

const generalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta de nuevo en un minuto.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de acceso, espera 15 minutos.' },
});

app.use((req, res, next) => {
  if (process.env.ENABLE_STACK_HINT === '1') {
    res.setHeader('X-Stack-Hint', '🛠️ Pista: visita /tech');
  }
  next();
});

app.use(passport.initialize());

app.use(cors());
app.use(express.json());

app.use('/api', generalLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/media', mediaRoutes); 
app.use('/api/projects', projectRoutes);
app.use('/api/project-categories', projectCategoryRoutes);

app.use(techRoutes);

export default app;
