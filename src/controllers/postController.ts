import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });


const prisma = new PrismaClient();

// Get all published posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { 
        author: { select: { name: true, email: true } },
        labels: true 
      },
    });
    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get a single post by ID
export const getPostById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: { 
        author: { select: { name: true, email: true } }, 
        comments: true,
        labels: true
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post :((' });
  }
};

// get the post from the backend 
export const getPostsBackEnd = async (req: Request, res: Response) => {
  console.log(req);
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { name: true, email: true } } },
    });
    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch posts, sí?' });
  }
}
  
// Create a new post
export const createPost = async (req: Request, res: Response) => {
  const { title, content, labels, isPublished } = req.body;
  let { id }: any = req.user; 
  let userId = parseInt(id);
  console.log(labels);
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: isPublished,
        authorId: userId,
        labels: {
          connect: labels.map((id: string | number) => ({ id: parseInt(id as string) }))
        }
      },
      include: {
        labels: true,
        author: true
      }
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ error: 'Failed to create post', details: errorMessage });
  }
};

// Update a post
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, published } = req.body;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content, published },
    });
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update post' });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete post' });
  }
};
