import { PrismaClient } from '@prisma/client';

// Un único cliente para todo el backend. Cada `new PrismaClient()` abre su propio pool de
// conexiones, y el pooler de Supabase en modo sesión solo admite 15 clientes en total: con un
// cliente por controlador se agotaba y todas las consultas fallaban con EMAXCONNSESSION.
export const prisma = new PrismaClient();
