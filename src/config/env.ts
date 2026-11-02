import 'dotenv/config';

const INSECURE_DEFAULT_SECRET = 'your_jwt_secret';

// Sin secreto propio, cualquiera podría firmar tokens válidos: mejor que el servidor no arranque
const readJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === INSECURE_DEFAULT_SECRET) {
    throw new Error('JWT_SECRET no está configurado: define un valor propio antes de arrancar.');
  }
  return secret;
};

export const JWT_SECRET = readJwtSecret();
