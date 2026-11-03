import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { v4 as uuidv4 } from 'uuid';

import { slugify } from '../utils/slugify';
import { toContentSummary } from '../utils/contentSummary';

import { supabase } from '../utils/supabase';

const MAX_POSTS_LIMIT = 100;

const parseLimit = (value: unknown) => {
  const limit = Number(value);
  return Number.isInteger(limit) && limit > 0 ? Math.min(limit, MAX_POSTS_LIMIT) : undefined;
};

// Get published posts without their full content, newest first (?limit=N returns the latest N)
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        labels: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseLimit(req.query.limit),
    });
    res.json(posts.map(toContentSummary));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get the slug of a random published post
export const getRandomPost = async (req: Request, res: Response): Promise<void> => {
  const where = { published: true, slug: { not: null } };

  try {
    const total = await prisma.post.count({ where });
    const post = await prisma.post.findFirst({
      where,
      select: { slug: true },
      orderBy: { id: 'asc' },
      skip: Math.floor(Math.random() * total),
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch random post' });
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
        author: { select: { name: true } },
        labels: true,
      },
    });

    // Un borrador no existe para quien no tiene sesión: 404 para no revelar que ese id está en uso
    if (!post || (!post.published && !req.user)) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.published) res.setHeader('Cache-Control', 'no-store');
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post :((' });
  }
};

// get post by slug
export const getPostBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    const post = await prisma.post.findFirst({
      where: { slug, published: true },
      include: {
        author: { select: { name: true } },
        labels: true,
      },
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json([post]); // opcional: o solo `res.json(post)` si prefieres
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching post by slug' });
  }
};

// Register a reader's visit. SQL directo porque Prisma actualizaría updatedAt, y una visita no es
// una edición del artículo
export const registerPostView = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    const updated =
      await prisma.$executeRaw`UPDATE "Post" SET "views" = "views" + 1 WHERE "slug" = ${slug} AND "published" = true`;
    res.status(updated > 0 ? 204 : 404).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register view' });
  }
};

// get the post from the backend
export const getPostsBackEnd = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { name: true } }, labels: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts, sí?' });
  }
};

// Create a new post
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, metaDescription, metaTitle, isPublished } = req.body;
    const labels = JSON.parse(req.body.labels);
    const file = req.file;

    let { id }: any = req.user;
    let userId = parseInt(id);

    let coverUrl = null;

    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      // Verificar que el bucket existe
      const { error: bucketError } = await supabase.storage.getBucket('images');
      if (bucketError) {
        console.error('Bucket error:', bucketError.message);
        throw new Error('Storage configuration error');
      }

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading to Supabase:', uploadError.message);
        throw new Error('Error uploading image');
      }

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);

      coverUrl = publicUrlData?.publicUrl ?? null;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        metaDescription,
        metaTitle,
        slug: slugify(title),
        published: isPublished === 'true',
        coverUrl,
        authorId: userId,
        labels: {
          connect: labels.map((id: string | number) => ({ id: parseInt(id as string) })),
        },
      },
      include: {
        labels: true,
        author: { select: { name: true } },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    // Solo envía la respuesta si no se ha enviado ya
    if (!res.headersSent) {
      const message = error instanceof Error ? error.message : 'Failed to create post';
      res.status(500).json({ error: message });
    }
  }
};

// Update a post
export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, metaDescription, metaTitle, isPublished, published, labels } = req.body;
  const file = req.file;

  try {
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;

    // El formulario de edición envía "isPublished"; togglePublishPost envía "published" directamente
    if (isPublished !== undefined) {
      updateData.published = isPublished === 'true' || isPublished === true;
    } else if (published !== undefined) {
      updateData.published = published === 'true' || published === true;
    }

    if (labels !== undefined) {
      const parsedLabels = typeof labels === 'string' ? JSON.parse(labels) : labels;
      // "set" sustituye las etiquetas; con "connect" nunca se quitaban las desmarcadas
      updateData.labels = {
        set: parsedLabels.map((labelId: string | number) => ({
          id: parseInt(labelId as string),
        })),
      };
    }

    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading to Supabase:', uploadError.message);
        throw new Error('Error uploading image');
      }

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);

      updateData.coverUrl = publicUrlData?.publicUrl ?? null;
    }

    const post = await prisma.post.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { labels: true, author: { select: { name: true } } },
    });
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
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
