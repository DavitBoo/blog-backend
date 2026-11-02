import { RequestHandler } from 'express';
import multer from 'multer';

const MAX_IMAGE_SIZE_MB = 15;

// SVG queda fuera a propósito: puede llevar scripts y se serviría desde un bucket público
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagen no permitido.'));
    }
  },
});

// Los archivos se guardan en memoria: colocar siempre después de autenticar
export const uploadImageFile = (fieldName: string): RequestHandler => {
  const handleUpload = upload.single(fieldName);

  return (req, res, next) => {
    handleUpload(req, res, (error: unknown) => {
      if (!error) {
        next();
      } else if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({ error: `La imagen supera los ${MAX_IMAGE_SIZE_MB} MB.` });
      } else {
        const message = error instanceof Error ? error.message : 'No se pudo procesar el archivo.';
        res.status(400).json({ error: message });
      }
    });
  };
};
