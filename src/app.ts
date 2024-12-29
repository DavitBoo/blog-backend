import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

export default app;
