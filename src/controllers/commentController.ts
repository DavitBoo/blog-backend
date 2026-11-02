import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

const MAX_COMMENT_LENGTH = 2000;
const MAX_EMAIL_LENGTH = 254;
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email: unknown): email is string =>
  typeof email === 'string' && email.length <= MAX_EMAIL_LENGTH && EMAIL_FORMAT.test(email);

// Add a comment to a post (public). It stays hidden until approved from the dashboard
export const createComment = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  const { email, content } = req.body ?? {};
  const trimmedContent = typeof content === 'string' ? content.trim() : '';

  if (!Number.isInteger(postId)) {
    res.status(400).json({ error: 'Artículo no válido.' });
    return;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Introduce un email válido.' });
    return;
  }
  if (!trimmedContent || trimmedContent.length > MAX_COMMENT_LENGTH) {
    res.status(400).json({
      error: `El comentario debe tener entre 1 y ${MAX_COMMENT_LENGTH} caracteres.`,
    });
    return;
  }

  try {
    const post = await prisma.post.findFirst({
      where: { id: postId, published: true },
      select: { id: true },
    });
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const comment = await prisma.comment.create({
      data: { email, content: trimmedContent, postId, approved: false },
      select: { id: true, approved: true, createdAt: true },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add comment' });
  }
};

// Get approved comments for a post (public)
export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId), approved: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        postId: true,
        approved: true,
        createdAt: true,
        email: Boolean(req.user),
      },
    });
    if (req.user) res.setHeader('Cache-Control', 'no-store');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Get all comments across all posts (admin)
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        post: { select: { id: true, title: true, slug: true } },
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Delete a comment (admin)
export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete comment' });
  }
};

// Toggle approved status (admin)
export const toggleApproveComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const current = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      select: { approved: true },
    });

    if (!current) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { approved: !current.approved },
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update comment' });
  }
};
