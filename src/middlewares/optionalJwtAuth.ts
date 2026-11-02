import { RequestHandler } from 'express';
import passport from 'passport';

const jwtAuth = passport.authenticate('jwt', { session: false });

// Para rutas públicas que muestran más a quien tiene sesión: sin token sigue como anónimo, pero un
// token caducado da 401 para que el dashboard pueda avisar en vez de recibir un 404 engañoso
export const optionalJwtAuth: RequestHandler = (req, res, next) =>
  req.headers.authorization ? jwtAuth(req, res, next) : next();
