// controllers/techController.ts
import { Request, Response } from 'express';
import os from 'os';


export async function getTech(req: Request, res: Response) {
  const data = {
    app: {
      name: "mi-blog",
      description: "El desarrollo de mi web"
    },
    stack: {
      frontend: "Next.js",
      backend: "Express + Prisma",
      database: "Supabase (Postgres gestionado)",
      hosting: ["Vercel (frontend)", "Render (backend)"]
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  res.status(200).json(data);
}