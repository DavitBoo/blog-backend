import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { slugify } from '../utils/slugify';

const prisma = new PrismaClient();

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.vidaTag.findMany({ orderBy: { nombre: 'asc' } });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.body;
    const tag = await prisma.vidaTag.create({
      data: { nombre, slug: slugify(nombre) },
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create tag' });
  }
};

export const updateTag = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { nombre } = req.body;
    const tag = await prisma.vidaTag.update({
      where: { id: parseInt(id) },
      data: { nombre, slug: slugify(nombre) },
    });
    res.json(tag);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update tag' });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.vidaTag.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete tag' });
  }
};
