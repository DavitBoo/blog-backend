import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '../utils/slugify';
import { toContentSummary } from '../utils/contentSummary';
import { supabase } from '../utils/supabase';

// Get all published projects, without their full content
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects.map(toContentSummary));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { name: true } },
        category: true,
      },
    });

    // Un borrador no existe para quien no tiene sesión: 404 para no revelar que ese id está en uso
    if (!project || (!project.published && !req.user)) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.published) res.setHeader('Cache-Control', 'no-store');
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// get project by slug
export const getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  try {
    const project = await prisma.project.findFirst({
      where: { slug, published: true },
      include: {
        author: { select: { name: true } },
        category: true,
      },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json([project]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching project by slug' });
  }
};

// Register a reader's visit. SQL directo porque Prisma actualizaría updatedAt, y una visita no es
// una edición del proyecto
export const registerProjectView = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    const updated =
      await prisma.$executeRaw`UPDATE "Project" SET "views" = "views" + 1 WHERE "slug" = ${slug} AND "published" = true`;
    res.status(updated > 0 ? 204 : 404).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register view' });
  }
};

// get projects for backend (includes unpublished)
export const getProjectsBackEnd = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        author: { select: { name: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects backend' });
  }
};

// Create a new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, isPublished, categoryId } = req.body;
    const file = req.file;

    let { id }: any = req.user;
    let userId = parseInt(id);

    let coverUrl = null;

    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

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
        throw new Error('Error uploading image');
      }

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);

      coverUrl = publicUrlData?.publicUrl ?? null;
    }

    const project = await prisma.project.create({
      data: {
        title,
        content,
        slug: slugify(title),
        published: isPublished === 'true' || isPublished === true,
        coverUrl,
        authorId: userId,
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
      include: {
        category: true,
        author: { select: { name: true } },
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    if (!res.headersSent) {
      const message = error instanceof Error ? error.message : 'Failed to create project';
      res.status(500).json({ error: message });
    }
  }
};

// Update a project
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, isPublished, categoryId } = req.body;
  const file = req.file;

  try {
    let coverUrl = undefined; // undefined ignores field in Prisma

    if (file) {
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);
        coverUrl = publicUrlData?.publicUrl ?? null;
      }
    }

    const updateData: any = {
      title,
      content,
      published: isPublished === 'true' || isPublished === true,
      categoryId: categoryId && categoryId !== 'null' ? parseInt(categoryId) : null,
    };

    if (coverUrl !== undefined) {
      updateData.coverUrl = coverUrl;
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to update project' });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete project' });
  }
};
