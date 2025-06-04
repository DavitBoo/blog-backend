import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

import {slugify} from '../utils/slugify'

import {supabase} from "../utils/supabase"

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
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get a single post by ID
  export const getPostById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      // admin visits do not count haha
      // await prisma.post.update({
      //   where: { id: Number(id) },
      //   data: { views: { increment: 1 } },
      // });

      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        include: { 
          author: { select: { name: true, email: true } }, 
          comments: true,
          labels: true,
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


// get post by slug
export const getPostBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  console.log(slug);

  try {
    const post = await prisma.post.findFirst({
      where: { slug },
      include: {
        author: { select: { name: true, email: true } },
        comments: true,
        labels: true,
      },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return
    }

    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    res.json([post]); // opcional: o solo `res.json(post)` si prefieres
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching post by slug' });
  }
};


// get the post from the backend 
export const getPostsBackEnd = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { name: true, email: true } } },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts, sí?' });
  }
}
  
// Create a new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, isPublished } = req.body;
    const labels = JSON.parse(req.body.labels);
    const file = req.file;

    console.log(req.body);
    let { id }: any = req.user;
    let userId = parseInt(id);

    let coverUrl = null;

    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      // Verificar que el bucket existe
      const { error: bucketError } = await supabase.storage.getBucket('images');
      if (bucketError) {
        console.error("Bucket error:", bucketError.message);
        throw new Error("Storage configuration error");
      }

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading to Supabase:", uploadError.message);
        throw new Error("Error uploading image");
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      coverUrl = publicUrlData?.publicUrl ?? null;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug: slugify(title), 
        published: isPublished === "true",
        coverUrl,
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
    console.error("Error creating post:", error);
    // Solo envía la respuesta si no se ha enviado ya
    if (!res.headersSent) {
      const message = error instanceof Error ? error.message : "Failed to create post";
      res.status(500).json({ error: message });
    }
  }
};

// Update a post
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, published, labels } = req.body;

  try {
    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: { title, content, published, labels: {
        connect: labels.map((id: string | number) => ({ id: parseInt(id as string) }))
      } },
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
