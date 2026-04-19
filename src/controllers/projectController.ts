import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '../utils/slugify';
import { supabase } from "../utils/supabase";

const prisma = new PrismaClient();

// Get all published projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      include: { 
        author: { select: { name: true, email: true } },
        category: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
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
        author: { select: { name: true, email: true } }, 
        category: true
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
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
      where: { slug },
      include: {
        author: { select: { name: true, email: true } },
        category: true
      },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await prisma.project.update({
      where: { id: project.id },
      data: { views: { increment: 1 } },
    });

    res.json([project]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching project by slug' });
  }
};

// get projects for backend (includes unpublished)
export const getProjectsBackEnd = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: { 
        author: { select: { name: true, email: true } },
        category: true
      },
      orderBy: { createdAt: 'desc' }
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
        throw new Error("Error uploading image");
      }

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      coverUrl = publicUrlData?.publicUrl ?? null;
    }

    const project = await prisma.project.create({
      data: {
        title,
        content,
        slug: slugify(title), 
        published: isPublished === "true" || isPublished === true,
        coverUrl,
        authorId: userId,
        categoryId: categoryId ? parseInt(categoryId) : null
      },
      include: {
        category: true,
        author: true
      }
    });

    res.status(201).json(project);

  } catch (error) {
    console.error("Error creating project:", error);
    if (!res.headersSent) {
      const message = error instanceof Error ? error.message : "Failed to create project";
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
        .from("images")
        .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(fileName);
        coverUrl = publicUrlData?.publicUrl ?? null;
      }
    }

    const updateData: any = { 
      title, 
      content, 
      published: isPublished === "true" || isPublished === true,
      categoryId: categoryId && categoryId !== "null" ? parseInt(categoryId) : null
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
