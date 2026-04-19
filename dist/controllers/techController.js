"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTech = getTech;
function getTech(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
