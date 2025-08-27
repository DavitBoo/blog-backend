import express from 'express';
import passport from './config/passport';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import labelRoutes from './routes/labelRoutes';
import techRoutes from './routes/techRoutes';

const app = express();

app.use((req, res, next) => {
  if (process.env.ENABLE_STACK_HINT === '1') {
    res.setHeader('X-Stack-Hint', '🛠️ Pista: visita /tech');
  }
  next();
});

app.use(passport.initialize());     // initializes passport before use it   

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/labels', labelRoutes);

app.use(techRoutes);

export default app;
