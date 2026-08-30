import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { slugify } from '../utils/slugify';

const prisma = new PrismaClient();

const ITEM_INCLUDE = {
  categoria: true,
  tags: true,
  enlaces: { orderBy: { orden: 'asc' as const } },
  media: { orderBy: { orden: 'asc' as const } },
  relacionesA: { include: { itemB: { select: { id: true, slug: true } } } },
  relacionesB: { include: { itemA: { select: { id: true, slug: true } } } },
};

// Forma pública que consume la escena 3D (ver src/app/utils/vidaApi.ts en my-blog)
const mapItemPublic = (it: any) => ({
  id: it.id,
  slug: it.slug,
  categoria: it.categoria.slug,
  ambito: it.ambito,
  titulo: it.titulo,
  subtitulo: it.subtitulo,
  resumen: it.resumen,
  descripcion: it.descripcion,
  fechaInicio: it.fechaInicio,
  fechaFin: it.fechaFin,
  precisionFecha: it.precisionFecha,
  enCurso: it.enCurso,
  destacado: it.destacado,
  peso: it.peso,
  ciudad: it.ciudad,
  pais: it.pais,
  lat: it.lat,
  lng: it.lng,
  meta: it.meta,
  tags: (it.tags || []).map((t: any) => t.nombre),
  enlaces: (it.enlaces || []).map((e: any) => ({ tipo: e.tipo, url: e.url, etiqueta: e.etiqueta })),
  media: (it.media || []).map((m: any) => ({
    tipo: m.tipo,
    src: m.src,
    alt: m.alt,
    principal: m.principal,
  })),
  relacionados: [
    ...(it.relacionesA || []).map((r: any) => r.itemB.slug),
    ...(it.relacionesB || []).map((r: any) => r.itemA.slug),
  ],
});

// Forma completa (con ids) que consume el formulario de edición del dashboard
const mapItemBackend = (it: any) => ({
  id: it.id,
  slug: it.slug,
  categoriaId: it.categoriaId,
  categoria: it.categoria,
  ambito: it.ambito,
  titulo: it.titulo,
  subtitulo: it.subtitulo,
  resumen: it.resumen,
  descripcion: it.descripcion,
  fechaInicio: it.fechaInicio,
  fechaFin: it.fechaFin,
  precisionFecha: it.precisionFecha,
  enCurso: it.enCurso,
  destacado: it.destacado,
  peso: it.peso,
  ciudad: it.ciudad,
  pais: it.pais,
  lat: it.lat,
  lng: it.lng,
  meta: it.meta,
  publicado: it.publicado,
  tags: (it.tags || []).map((t: any) => ({ id: t.id, nombre: t.nombre })),
  enlaces: (it.enlaces || []).map((e: any) => ({
    id: e.id,
    tipo: e.tipo,
    url: e.url,
    etiqueta: e.etiqueta,
    orden: e.orden,
  })),
  media: (it.media || []).map((m: any) => ({
    id: m.id,
    tipo: m.tipo,
    src: m.src,
    alt: m.alt,
    principal: m.principal,
    orden: m.orden,
  })),
  relacionados: [
    ...(it.relacionesA || []).map((r: any) => r.itemB.id),
    ...(it.relacionesB || []).map((r: any) => r.itemA.id),
  ],
});

// GET /api/vida/items (público)
export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await prisma.vidaItem.findMany({
      where: { publicado: true, categoria: { publicada: true } },
      include: ITEM_INCLUDE,
      orderBy: { id: 'asc' },
    });
    res.json(items.map(mapItemPublic));
  } catch (error) {
    console.error('Error fetching vida items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

// GET /api/vida/items/backend (dashboard, incluye no publicados)
export const getItemsBackend = async (req: Request, res: Response) => {
  try {
    const items = await prisma.vidaItem.findMany({
      include: { categoria: true, tags: true },
      orderBy: { id: 'desc' },
    });
    res.json(
      items.map((it) => ({
        id: it.id,
        slug: it.slug,
        titulo: it.titulo,
        categoria: it.categoria,
        ambito: it.ambito,
        destacado: it.destacado,
        publicado: it.publicado,
        tags: it.tags.map((t) => t.nombre),
      })),
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

// GET /api/vida/items/:id (dashboard, para el formulario de edición)
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const item = await prisma.vidaItem.findUnique({
      where: { id: parseInt(id) },
      include: ITEM_INCLUDE,
    });
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(mapItemBackend(item));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

const parseMeta = (meta: unknown) => {
  if (meta == null || meta === '') return {};
  if (typeof meta === 'object') return meta;
  try {
    const parsed = JSON.parse(String(meta));
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

const buildScalarData = (body: any) => ({
  categoriaId: parseInt(body.categoriaId),
  ambito: body.ambito || null,
  titulo: body.titulo,
  subtitulo: body.subtitulo || null,
  resumen: body.resumen,
  descripcion: body.descripcion || null,
  fechaInicio: new Date(body.fechaInicio),
  fechaFin: body.fechaFin ? new Date(body.fechaFin) : null,
  precisionFecha: body.precisionFecha || 'anio',
  enCurso: Boolean(body.enCurso),
  destacado: Boolean(body.destacado),
  peso: body.peso != null ? Number(body.peso) : 3,
  ciudad: body.ciudad || null,
  pais: body.pais || null,
  lat: body.lat != null && body.lat !== '' ? Number(body.lat) : null,
  lng: body.lng != null && body.lng !== '' ? Number(body.lng) : null,
  meta: parseMeta(body.meta),
  publicado: body.publicado == null ? true : Boolean(body.publicado),
});

// Sincroniza las relaciones cruzadas de un ítem con la lista deseada de otros ítems.
// Cada pareja se guarda una sola vez con itemAId < itemBId.
const syncRelaciones = async (itemId: number, relacionadosIds: number[]) => {
  const desired = new Set(
    (relacionadosIds || []).map((n) => Number(n)).filter((n) => Number.isFinite(n) && n !== itemId),
  );

  const existentes = await prisma.vidaRelacion.findMany({
    where: { OR: [{ itemAId: itemId }, { itemBId: itemId }] },
  });
  const otroId = (r: { itemAId: number; itemBId: number }) =>
    r.itemAId === itemId ? r.itemBId : r.itemAId;
  const existentesIds = new Set(existentes.map(otroId));

  const aBorrar = existentes.filter((r) => !desired.has(otroId(r)));
  const aCrear = [...desired].filter((id) => !existentesIds.has(id));

  await Promise.all(
    aBorrar.map((r) =>
      prisma.vidaRelacion.delete({
        where: { itemAId_itemBId: { itemAId: r.itemAId, itemBId: r.itemBId } },
      }),
    ),
  );
  await Promise.all(
    aCrear.map((id) => {
      const itemAId = Math.min(itemId, id);
      const itemBId = Math.max(itemId, id);
      return prisma.vidaRelacion.upsert({
        where: { itemAId_itemBId: { itemAId, itemBId } },
        update: {},
        create: { itemAId, itemBId },
      });
    }),
  );
};

// POST /api/vida/items (dashboard)
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const tagIds: number[] = Array.isArray(body.tags) ? body.tags.map(Number) : [];
    const enlaces = Array.isArray(body.enlaces) ? body.enlaces : [];
    const media = Array.isArray(body.media) ? body.media : [];
    const relacionados: number[] = Array.isArray(body.relacionados)
      ? body.relacionados.map(Number)
      : [];

    const item = await prisma.vidaItem.create({
      data: {
        ...buildScalarData(body),
        slug: body.slug ? slugify(body.slug) : slugify(body.titulo),
        tags: { connect: tagIds.map((id) => ({ id })) },
        enlaces: {
          create: enlaces.map((e: any, i: number) => ({
            tipo: e.tipo,
            url: e.url,
            etiqueta: e.etiqueta || null,
            orden: i,
          })),
        },
        media: {
          create: media.map((m: any, i: number) => ({
            tipo: m.tipo,
            src: m.src,
            alt: m.alt || null,
            principal: Boolean(m.principal),
            orden: i,
          })),
        },
      },
      include: ITEM_INCLUDE,
    });

    if (relacionados.length) await syncRelaciones(item.id, relacionados);

    const full = await prisma.vidaItem.findUnique({
      where: { id: item.id },
      include: ITEM_INCLUDE,
    });
    res.status(201).json(mapItemBackend(full));
  } catch (error) {
    console.error('Error creating vida item:', error);
    const message = error instanceof Error ? error.message : 'Failed to create item';
    res.status(500).json({ error: message });
  }
};

// PATCH /api/vida/items/:id (dashboard)
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const itemId = parseInt(id);
  try {
    const body = req.body;
    const tagIds: number[] = Array.isArray(body.tags) ? body.tags.map(Number) : [];
    const enlaces = Array.isArray(body.enlaces) ? body.enlaces : [];
    const media = Array.isArray(body.media) ? body.media : [];
    const relacionados: number[] = Array.isArray(body.relacionados)
      ? body.relacionados.map(Number)
      : [];

    await prisma.$transaction([
      prisma.vidaItem.update({
        where: { id: itemId },
        data: {
          ...buildScalarData(body),
          ...(body.slug ? { slug: slugify(body.slug) } : {}),
          tags: { set: tagIds.map((tid) => ({ id: tid })) },
        },
      }),
      prisma.vidaEnlace.deleteMany({ where: { itemId } }),
      prisma.vidaMedia.deleteMany({ where: { itemId } }),
      ...(enlaces.length
        ? [
            prisma.vidaEnlace.createMany({
              data: enlaces.map((e: any, i: number) => ({
                itemId,
                tipo: e.tipo,
                url: e.url,
                etiqueta: e.etiqueta || null,
                orden: i,
              })),
            }),
          ]
        : []),
      ...(media.length
        ? [
            prisma.vidaMedia.createMany({
              data: media.map((m: any, i: number) => ({
                itemId,
                tipo: m.tipo,
                src: m.src,
                alt: m.alt || null,
                principal: Boolean(m.principal),
                orden: i,
              })),
            }),
          ]
        : []),
    ]);

    await syncRelaciones(itemId, relacionados);

    const full = await prisma.vidaItem.findUnique({ where: { id: itemId }, include: ITEM_INCLUDE });
    res.json(mapItemBackend(full));
  } catch (error) {
    console.error('Error updating vida item:', error);
    const message = error instanceof Error ? error.message : 'Failed to update item';
    res.status(400).json({ error: message });
  }
};

// DELETE /api/vida/items/:id (dashboard)
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.vidaItem.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete item' });
  }
};
