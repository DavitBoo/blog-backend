import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

// GET /api/vida/libros (público, catálogo /libros)
// Devuelve el catálogo completo de una vez: la página agrupa/filtra/busca en el
// cliente (por año o género), así que no tiene sentido paginar en el servidor.
export const getLibros = async (req: Request, res: Response) => {
  try {
    const anioActual = new Date().getFullYear();
    const [libros, total, esteAnio, info] = await Promise.all([
      prisma.vidaLibro.findMany({ orderBy: [{ anioLectura: 'desc' }, { titulo: 'asc' }] }),
      prisma.vidaLibro.count(),
      prisma.vidaLibro.count({ where: { anioLectura: anioActual } }),
      prisma.vidaLecturasInfo.findUnique({ where: { id: 1 } }),
    ]);
    res.json({
      resumen: { total, esteAnio, cifra: info?.cifra || '' },
      libros: libros.map((l) => ({
        titulo: l.titulo,
        autor: l.autor,
        anioLectura: l.anioLectura,
        genero: l.genero,
        nota: l.nota,
        color: l.color,
      })),
    });
  } catch (error) {
    console.error('Error fetching libros:', error);
    res.status(500).json({ error: 'Failed to fetch libros' });
  }
};

// GET /api/vida/libros/backend (dashboard)
export const getLibrosBackend = async (req: Request, res: Response) => {
  try {
    const libros = await prisma.vidaLibro.findMany({
      orderBy: [{ anioLectura: 'desc' }, { orden: 'asc' }],
    });
    res.json(libros);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch libros' });
  }
};

// GET /api/vida/libros/preview (público, panel de la isla portal)
export const getLibrosPreview = async (req: Request, res: Response) => {
  try {
    const anioActual = new Date().getFullYear();
    const [total, esteAnio, destacados, info] = await Promise.all([
      prisma.vidaLibro.count(),
      prisma.vidaLibro.count({ where: { anioLectura: anioActual } }),
      prisma.vidaLibro.findMany({
        where: { destacado: true },
        orderBy: [{ anioLectura: 'desc' }, { orden: 'asc' }],
        take: 5,
      }),
      prisma.vidaLecturasInfo.findUnique({ where: { id: 1 } }),
    ]);
    res.json({
      total,
      este_anio: esteAnio,
      cifra: info?.cifra || '',
      destacados: destacados.map((l) => ({
        titulo: l.titulo,
        autor: l.autor,
        anio_lectura: l.anioLectura,
        color: l.color,
      })),
    });
  } catch (error) {
    console.error('Error fetching lecturas preview:', error);
    res.status(500).json({ error: 'Failed to fetch preview' });
  }
};

// GET /api/vida/libros/resumen (dashboard)
export const getLecturasResumen = async (req: Request, res: Response) => {
  try {
    const info = await prisma.vidaLecturasInfo.findUnique({ where: { id: 1 } });
    res.json({ cifra: info?.cifra || '' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resumen' });
  }
};

// PATCH /api/vida/libros/resumen (dashboard, auth)
export const updateLecturasResumen = async (req: Request, res: Response) => {
  try {
    const { cifra } = req.body;
    const info = await prisma.vidaLecturasInfo.upsert({
      where: { id: 1 },
      update: { cifra },
      create: { id: 1, cifra },
    });
    res.json({ cifra: info.cifra || '' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update resumen' });
  }
};

export const getLibroById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const libro = await prisma.vidaLibro.findUnique({ where: { id: parseInt(id) } });
    if (!libro) {
      res.status(404).json({ error: 'Libro not found' });
      return;
    }
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch libro' });
  }
};

export const createLibro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { titulo, autor, anioLectura, genero, nota, color, paginas, destacado, orden } = req.body;
    const libro = await prisma.vidaLibro.create({
      data: {
        titulo,
        autor,
        anioLectura: Number(anioLectura),
        genero: genero || null,
        nota: nota || null,
        color: color || null,
        paginas: paginas != null && paginas !== '' ? Number(paginas) : null,
        destacado: Boolean(destacado),
        orden: orden != null ? Number(orden) : 0,
      },
    });
    res.status(201).json(libro);
  } catch (error) {
    console.error('Error creating libro:', error);
    res.status(500).json({ error: 'Failed to create libro' });
  }
};

export const updateLibro = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const { titulo, autor, anioLectura, genero, nota, color, paginas, destacado, orden } = req.body;
    const data: any = {};
    if (titulo !== undefined) data.titulo = titulo;
    if (autor !== undefined) data.autor = autor;
    if (anioLectura !== undefined) data.anioLectura = Number(anioLectura);
    if (genero !== undefined) data.genero = genero || null;
    if (nota !== undefined) data.nota = nota || null;
    if (color !== undefined) data.color = color || null;
    if (paginas !== undefined) data.paginas = paginas !== '' ? Number(paginas) : null;
    if (destacado !== undefined) data.destacado = Boolean(destacado);
    if (orden !== undefined) data.orden = Number(orden);

    const libro = await prisma.vidaLibro.update({ where: { id: parseInt(id) }, data });
    res.json(libro);
  } catch (error) {
    console.error('Error updating libro:', error);
    res.status(400).json({ error: 'Failed to update libro' });
  }
};

export const deleteLibro = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.vidaLibro.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete libro' });
  }
};
