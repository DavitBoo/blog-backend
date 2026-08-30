import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a comment to a post (public)
export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { email, content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: { email, content, postId: parseInt(postId) },
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
    });
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
