import { Request, Response } from "express"; // ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add a comment to a post
export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { email, content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: { email, content, postId: parseInt(postId) }, // parseInt always. From params string are coming.
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: "Failed to add comment" });
  }
};

// Get all comments for a post
export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      orderBy: { createdAt: "desc" },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
