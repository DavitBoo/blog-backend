// Seed de ejemplo para el archipiélago "Vida".
// La geometría de las islas (pos_x/pos_y/radio) viene del diseño original;
// el contenido de los ítems es un placeholder evidente, no biografía real.
// Ejecutar con: npx ts-node prisma/seedVida.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIAS = [
  { slug: 'proyectos', nombre: 'Proyectos', orden: 1, posX: 0, posY: -30, radio: 36, tipoContenido: 'items' },
  { slug: 'viajes', nombre: 'Viajes y lugares', orden: 2, posX: -132, posY: -96, radio: 33, tipoContenido: 'items' },
  { slug: 'trabajos', nombre: 'Trabajos', orden: 3, posX: 128, posY: -84, radio: 24, tipoContenido: 'items' },
  { slug: 'estudios', nombre: 'Estudios', orden: 4, posX: -108, posY: 74, radio: 26, tipoContenido: 'items' },
  { slug: 'idiomas', nombre: 'Idiomas', orden: 5, posX: 104, posY: 86, radio: 23, tipoContenido: 'items' },
  { slug: 'musica', nombre: 'Grupos de música', orden: 6, posX: -18, posY: 158, radio: 21, tipoContenido: 'items' },
  {
    slug: 'lecturas',
    nombre: 'Lecturas',
    orden: 7,
    posX: 196,
    posY: 26,
    radio: 20,
    tipoContenido: 'portal',
    urlDestino: '/libros',
    endpointPreview: '/api/vida/libros/preview',
  },
] as const;

const PLACEHOLDER_DESC: Record<string, string> = {
  proyectos: 'Descripción de la categoría — edítala desde el panel de administración.',
  viajes: 'Descripción de la categoría — edítala desde el panel de administración.',
  trabajos: 'Descripción de la categoría — edítala desde el panel de administración.',
  estudios: 'Descripción de la categoría — edítala desde el panel de administración.',
  idiomas: 'Descripción de la categoría — edítala desde el panel de administración.',
  musica: 'Descripción de la categoría — edítala desde el panel de administración.',
  lecturas: 'Los libros no están en 3D: viven en su propia página.',
};

type SeedItem = {
  slug: string;
  categoria: string;
  ambito?: string;
  titulo: string;
  subtitulo?: string;
  resumen: string;
  fechaInicio: string;
  precisionFecha?: string;
  enCurso?: boolean;
  destacado?: boolean;
  peso?: number;
  tags?: string[];
  enlaces?: { tipo: string; url: string; etiqueta?: string }[];
  relacionados?: string[];
};

const ITEMS: SeedItem[] = [
  { slug: 'ejemplo-proyecto-1', categoria: 'proyectos', ambito: 'desarrollo', titulo: 'Ítem de ejemplo — Proyectos 1',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2023-01-01', precisionFecha: 'anio', enCurso: true, destacado: true, peso: 5,
    tags: ['ejemplo'], enlaces: [{ tipo: 'web', url: 'https://example.com', etiqueta: 'Enlace de ejemplo' }],
    relacionados: ['ejemplo-viaje-1'] },
  { slug: 'ejemplo-proyecto-2', categoria: 'proyectos', ambito: 'lutheria', titulo: 'Ítem de ejemplo — Proyectos 2',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2022-06-01', precisionFecha: 'mes', peso: 3, tags: ['ejemplo'] },

  { slug: 'ejemplo-viaje-1', categoria: 'viajes', titulo: 'Ítem de ejemplo — Viajes 1',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2021-03-01', precisionFecha: 'mes', destacado: true, peso: 4, tags: ['ejemplo'],
    relacionados: ['ejemplo-proyecto-1', 'ejemplo-trabajo-1'] },
  { slug: 'ejemplo-viaje-2', categoria: 'viajes', titulo: 'Ítem de ejemplo — Viajes 2',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2020', precisionFecha: 'anio', peso: 2, tags: ['ejemplo'] },

  { slug: 'ejemplo-trabajo-1', categoria: 'trabajos', titulo: 'Ítem de ejemplo — Trabajos 1',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2019-09-01', precisionFecha: 'mes', destacado: true, peso: 5, tags: ['ejemplo'],
    relacionados: ['ejemplo-viaje-1'] },
  { slug: 'ejemplo-trabajo-2', categoria: 'trabajos', titulo: 'Ítem de ejemplo — Trabajos 2',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2022', precisionFecha: 'anio', enCurso: true, peso: 3, tags: ['ejemplo'] },

  { slug: 'ejemplo-estudio-1', categoria: 'estudios', titulo: 'Ítem de ejemplo — Estudios 1',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2018', precisionFecha: 'anio', destacado: true, peso: 4, tags: ['ejemplo'] },
  { slug: 'ejemplo-estudio-2', categoria: 'estudios', titulo: 'Ítem de ejemplo — Estudios 2',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2024', precisionFecha: 'anio', enCurso: true, peso: 2, tags: ['ejemplo'] },

  { slug: 'ejemplo-idioma-1', categoria: 'idiomas', titulo: 'Ítem de ejemplo — Idiomas 1',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2010', precisionFecha: 'anio', enCurso: true, destacado: true, peso: 5, tags: ['ejemplo'] },
  { slug: 'ejemplo-idioma-2', categoria: 'idiomas', titulo: 'Ítem de ejemplo — Idiomas 2',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2019', precisionFecha: 'anio', peso: 2, tags: ['ejemplo'] },

  { slug: 'ejemplo-musica-1', categoria: 'musica', titulo: 'Ítem de ejemplo — Música 1',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2020-01-01', precisionFecha: 'mes', destacado: true, peso: 4, tags: ['ejemplo'] },
  { slug: 'ejemplo-musica-2', categoria: 'musica', titulo: 'Ítem de ejemplo — Música 2',
    resumen: 'Contenido de ejemplo para comprobar que la isla se ve bien. Sustitúyelo desde el panel de administración.',
    fechaInicio: '2023', precisionFecha: 'anio', enCurso: true, peso: 3, tags: ['ejemplo'] },
];

const LIBROS = [
  { titulo: 'Libro de ejemplo 1', autor: 'Autor de ejemplo', anioLectura: new Date().getFullYear(), genero: 'Novela',
    nota: 'Nota de ejemplo — sustitúyela desde el panel de administración.', color: '#2f6b7a', destacado: true, paginas: 320 },
  { titulo: 'Libro de ejemplo 2', autor: 'Autor de ejemplo', anioLectura: new Date().getFullYear() - 1, genero: 'Ensayo',
    color: '#8a6a3d', destacado: true, paginas: 210 },
  { titulo: 'Libro de ejemplo 3', autor: 'Autor de ejemplo', anioLectura: new Date().getFullYear() - 1, genero: 'Técnico',
    nota: 'Otra nota de ejemplo, más corta.', color: '#6b4a3a', destacado: false, paginas: 180 },
  { titulo: 'Libro de ejemplo 4', autor: 'Autor de ejemplo', anioLectura: new Date().getFullYear() - 2, genero: 'Novela',
    color: '#3d5a8a', destacado: false, paginas: 260 },
];

async function main() {
  console.log('Seeding Vida: categorías...');
  const categoriaIds: Record<string, number> = {};
  for (const c of CATEGORIAS) {
    const categoria = await prisma.vidaCategoria.upsert({
      where: { slug: c.slug },
      update: {
        nombre: c.nombre,
        orden: c.orden,
        posX: c.posX,
        posY: c.posY,
        radio: c.radio,
        tipoContenido: c.tipoContenido,
        urlDestino: 'urlDestino' in c ? c.urlDestino : null,
        endpointPreview: 'endpointPreview' in c ? c.endpointPreview : null,
      },
      create: {
        slug: c.slug,
        nombre: c.nombre,
        descripcion: PLACEHOLDER_DESC[c.slug],
        orden: c.orden,
        posX: c.posX,
        posY: c.posY,
        radio: c.radio,
        tipoContenido: c.tipoContenido,
        urlDestino: 'urlDestino' in c ? c.urlDestino : null,
        endpointPreview: 'endpointPreview' in c ? c.endpointPreview : null,
      },
    });
    categoriaIds[c.slug] = categoria.id;
  }

  console.log('Seeding Vida: tag "ejemplo"...');
  const tagEjemplo = await prisma.vidaTag.upsert({
    where: { slug: 'ejemplo' },
    update: {},
    create: { slug: 'ejemplo', nombre: 'ejemplo' },
  });

  console.log('Seeding Vida: ítems...');
  const itemIds: Record<string, number> = {};
  for (const it of ITEMS) {
    const item = await prisma.vidaItem.upsert({
      where: { slug: it.slug },
      update: {},
      create: {
        slug: it.slug,
        categoriaId: categoriaIds[it.categoria],
        ambito: it.ambito || null,
        titulo: it.titulo,
        subtitulo: it.subtitulo || null,
        resumen: it.resumen,
        fechaInicio: new Date(it.fechaInicio),
        precisionFecha: it.precisionFecha || 'anio',
        enCurso: !!it.enCurso,
        destacado: !!it.destacado,
        peso: it.peso ?? 3,
        meta: {},
        tags: it.tags?.includes('ejemplo') ? { connect: [{ id: tagEjemplo.id }] } : undefined,
        enlaces: it.enlaces
          ? { create: it.enlaces.map((e, i) => ({ tipo: e.tipo, url: e.url, etiqueta: e.etiqueta || null, orden: i })) }
          : undefined,
      },
    });
    itemIds[it.slug] = item.id;
  }

  console.log('Seeding Vida: relaciones cruzadas...');
  for (const it of ITEMS) {
    if (!it.relacionados) continue;
    const aId = itemIds[it.slug];
    for (const relSlug of it.relacionados) {
      const bId = itemIds[relSlug];
      if (!bId) continue;
      const itemAId = Math.min(aId, bId);
      const itemBId = Math.max(aId, bId);
      await prisma.vidaRelacion.upsert({
        where: { itemAId_itemBId: { itemAId, itemBId } },
        update: {},
        create: { itemAId, itemBId },
      });
    }
  }

  console.log('Seeding Vida: libros...');
  for (const l of LIBROS) {
    const exists = await prisma.vidaLibro.findFirst({ where: { titulo: l.titulo } });
    if (exists) await prisma.vidaLibro.update({ where: { id: exists.id }, data: l });
    else await prisma.vidaLibro.create({ data: l });
  }

  console.log('Seeding Vida: resumen de lecturas...');
  await prisma.vidaLecturasInfo.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, cifra: 'Cifra de ejemplo — edítala desde el panel de administración.' },
  });

  console.log('Vida seed completo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
