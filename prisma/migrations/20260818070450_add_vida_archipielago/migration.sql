-- CreateTable
CREATE TABLE "VidaCategoria" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "posX" DOUBLE PRECISION NOT NULL,
    "posY" DOUBLE PRECISION NOT NULL,
    "radio" DOUBLE PRECISION NOT NULL,
    "tipoContenido" TEXT NOT NULL DEFAULT 'items',
    "urlDestino" TEXT,
    "endpointPreview" TEXT,
    "publicada" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VidaCategoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VidaItem" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "ambito" TEXT,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT,
    "resumen" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE,
    "precisionFecha" TEXT NOT NULL DEFAULT 'anio',
    "enCurso" BOOLEAN NOT NULL DEFAULT false,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "peso" INTEGER NOT NULL DEFAULT 3,
    "ciudad" TEXT,
    "pais" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VidaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VidaTag" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "VidaTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VidaEnlace" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "etiqueta" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VidaEnlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VidaMedia" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VidaMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VidaRelacion" (
    "itemAId" INTEGER NOT NULL,
    "itemBId" INTEGER NOT NULL,
    "nota" TEXT,

    CONSTRAINT "VidaRelacion_pkey" PRIMARY KEY ("itemAId","itemBId")
);

-- CreateTable
CREATE TABLE "VidaLibro" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "anioLectura" INTEGER NOT NULL,
    "color" TEXT,
    "paginas" INTEGER,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VidaLibro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VidaLecturasInfo" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "cifra" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VidaLecturasInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VidaItemToVidaTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VidaItemToVidaTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "VidaCategoria_slug_key" ON "VidaCategoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VidaItem_slug_key" ON "VidaItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VidaTag_slug_key" ON "VidaTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "VidaTag_nombre_key" ON "VidaTag"("nombre");

-- CreateIndex
CREATE INDEX "_VidaItemToVidaTag_B_index" ON "_VidaItemToVidaTag"("B");

-- AddForeignKey
ALTER TABLE "VidaItem" ADD CONSTRAINT "VidaItem_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "VidaCategoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VidaEnlace" ADD CONSTRAINT "VidaEnlace_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "VidaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VidaMedia" ADD CONSTRAINT "VidaMedia_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "VidaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VidaRelacion" ADD CONSTRAINT "VidaRelacion_itemAId_fkey" FOREIGN KEY ("itemAId") REFERENCES "VidaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VidaRelacion" ADD CONSTRAINT "VidaRelacion_itemBId_fkey" FOREIGN KEY ("itemBId") REFERENCES "VidaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VidaItemToVidaTag" ADD CONSTRAINT "_VidaItemToVidaTag_A_fkey" FOREIGN KEY ("A") REFERENCES "VidaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VidaItemToVidaTag" ADD CONSTRAINT "_VidaItemToVidaTag_B_fkey" FOREIGN KEY ("B") REFERENCES "VidaTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
