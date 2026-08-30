import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { slugify } from '../utils/slugify';

const prisma = new PrismaClient();

const mapCategoria = (c: any) => ({
  id: c.id,
  slug: c.slug,
  nombre: c.nombre,
  descripcion: c.descripcion,
  orden: c.orden,
  posX: c.posX,
  posY: c.posY,
  radio: c.radio,
  tipoContenido: c.tipoContenido,
  urlDestino: c.urlDestino,
  endpointPreview: c.endpointPreview,
  publicada: c.publicada,
});

// Get published categories, for the public scene
export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.vidaCategoria.findMany({
      where: { publicada: true },
      orderBy: { orden: 'asc' },
    });
    res.json(categorias.map(mapCategoria));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categorias' });
  }
};

// Get all categories (including unpublished), for the dashboard
export const getCategoriasBackend = async (req: Request, res: Response) => {
  try {
    const categorias = await prisma.vidaCategoria.findMany({
      orderBy: { orden: 'asc' },
      include: { _count: { select: { items: true } } },
    });
    res.json(categorias.map((c) => ({ ...mapCategoria(c), itemsCount: c._count.items })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categorias' });
  }
};

export const getCategoriaById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const categoria = await prisma.vidaCategoria.findUnique({ where: { id: parseInt(id) } });
    if (!categoria) {
      res.status(404).json({ error: 'Categoria not found' });
      return;
    }
    res.json(mapCategoria(categoria));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categoria' });
  }
};

export const createCategoria = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombre,
      descripcion,
      orden,
      posX,
      posY,
      radio,
      tipoContenido,
      urlDestino,
      endpointPreview,
      publicada,
    } = req.body;
    const categoria = await prisma.vidaCategoria.create({
      data: {
        nombre,
        slug: slugify(nombre),
        descripcion: descripcion ?? null,
        orden: orden != null ? Number(orden) : 0,
        posX: Number(posX),
        posY: Number(posY),
        radio: Number(radio),
        tipoContenido: tipoContenido || 'items',
        urlDestino: urlDestino ?? null,
        endpointPreview: endpointPreview ?? null,
        publicada: publicada == null ? true : Boolean(publicada),
      },
    });
    res.status(201).json(mapCategoria(categoria));
  } catch (error) {
    console.error('Error creating categoria:', error);
    res.status(500).json({ error: 'Failed to create categoria' });
  }
};

export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const {
      nombre,
      descripcion,
      orden,
      posX,
      posY,
      radio,
      tipoContenido,
      urlDestino,
      endpointPreview,
      publicada,
    } = req.body;
    const data: any = {};
    if (nombre !== undefined) {
      data.nombre = nombre;
      data.slug = slugify(nombre);
    }
    if (descripcion !== undefined) data.descripcion = descripcion;
    if (orden !== undefined) data.orden = Number(orden);
    if (posX !== undefined) data.posX = Number(posX);
    if (posY !== undefined) data.posY = Number(posY);
    if (radio !== undefined) data.radio = Number(radio);
    if (tipoContenido !== undefined) data.tipoContenido = tipoContenido;
    if (urlDestino !== undefined) data.urlDestino = urlDestino;
    if (endpointPreview !== undefined) data.endpointPreview = endpointPreview;
    if (publicada !== undefined) data.publicada = Boolean(publicada);

    const categoria = await prisma.vidaCategoria.update({ where: { id: parseInt(id) }, data });
    res.json(mapCategoria(categoria));
  } catch (error) {
    console.error('Error updating categoria:', error);
    res.status(400).json({ error: 'Failed to update categoria' });
  }
};

export const deleteCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.vidaCategoria.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete categoria' });
  }
};
