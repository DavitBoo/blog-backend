import express from 'express';
import passport from './config/passport';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import labelRoutes from './routes/labelRoutes';

const app = express();

app.use(passport.initialize());     // initializes passport before use it

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/labels', labelRoutes);

export default app;
