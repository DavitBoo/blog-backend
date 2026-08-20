import { RequestHandler } from 'express';

// Para GETs públicos que el dashboard no consume: el navegador puede reutilizar
// la respuesta sin volver a preguntar al servidor durante maxAgeSeconds.
export const cacheControl = (maxAgeSeconds: number, staleWhileRevalidateSeconds = maxAgeSeconds): RequestHandler => {
  return (req, res, next) => {
    res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`);
    next();
  };
};

// Para GETs públicos que también usa el dashboard: siempre revalida contra el
// servidor (vía ETag) antes de reutilizar la respuesta, así nunca se ve un dato
// obsoleto tras crear/editar/borrar desde el dashboard.
export const revalidate: RequestHandler = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
};

// Para GETs protegidos por JWT: refuerza explícitamente que no deben cachearse.
export const noStore: RequestHandler = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
};
