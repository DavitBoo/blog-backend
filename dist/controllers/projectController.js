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
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectsBackEnd = exports.getProjectBySlug = exports.getProjectById = exports.getProjects = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const slugify_1 = require("../utils/slugify");
const supabase_1 = require("../utils/supabase");
const prisma = new client_1.PrismaClient();
// Get all published projects
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma.project.findMany({
            where: { published: true },
            include: {
                author: { select: { name: true, email: true } },
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});
exports.getProjects = getProjects;
// Get a single project by ID
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield prisma.project.findUnique({
            where: { id: parseInt(id) },
            include: {
                author: { select: { name: true, email: true } },
                category: true
            },
        });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});
exports.getProjectById = getProjectById;
// get project by slug
const getProjectBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const project = yield prisma.project.findFirst({
            where: { slug },
            include: {
                author: { select: { name: true, email: true } },
                category: true
            },
        });
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        yield prisma.project.update({
            where: { id: project.id },
            data: { views: { increment: 1 } },
        });
        res.json([project]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching project by slug' });
    }
});
exports.getProjectBySlug = getProjectBySlug;
// get projects for backend (includes unpublished)
const getProjectsBackEnd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma.project.findMany({
            include: {
                author: { select: { name: true, email: true } },
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects backend' });
    }
});
exports.getProjectsBackEnd = getProjectsBackEnd;
// Create a new project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, content, isPublished, categoryId } = req.body;
        const file = req.file;
        let { id } = req.user;
        let userId = parseInt(id);
        let coverUrl = null;
        if (file) {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
            const { error: bucketError } = yield supabase_1.supabase.storage.getBucket('images');
            if (bucketError) {
                console.error("Bucket error:", bucketError.message);
                throw new Error("Storage configuration error");
            }
            const { error: uploadError } = yield supabase_1.supabase.storage
                .from("images")
                .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });
            if (uploadError) {
                throw new Error("Error uploading image");
            }
            const { data: publicUrlData } = supabase_1.supabase.storage
                .from("images")
                .getPublicUrl(fileName);
            coverUrl = (_a = publicUrlData === null || publicUrlData === void 0 ? void 0 : publicUrlData.publicUrl) !== null && _a !== void 0 ? _a : null;
        }
        const project = yield prisma.project.create({
            data: {
                title,
                content,
                slug: (0, slugify_1.slugify)(title),
                published: isPublished === "true" || isPublished === true,
                coverUrl,
                authorId: userId,
                categoryId: categoryId ? parseInt(categoryId) : null
            },
            include: {
                category: true,
                author: true
            }
        });
        res.status(201).json(project);
    }
    catch (error) {
        console.error("Error creating project:", error);
        if (!res.headersSent) {
            const message = error instanceof Error ? error.message : "Failed to create project";
            res.status(500).json({ error: message });
        }
    }
});
exports.createProject = createProject;
// Update a project
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { title, content, isPublished, categoryId } = req.body;
    const file = req.file;
    try {
        let coverUrl = undefined; // undefined ignores field in Prisma
        if (file) {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
            const { error: uploadError } = yield supabase_1.supabase.storage
                .from("images")
                .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });
            if (!uploadError) {
                const { data: publicUrlData } = supabase_1.supabase.storage.from("images").getPublicUrl(fileName);
                coverUrl = (_a = publicUrlData === null || publicUrlData === void 0 ? void 0 : publicUrlData.publicUrl) !== null && _a !== void 0 ? _a : null;
            }
        }
        const updateData = {
            title,
            content,
            published: isPublished === "true" || isPublished === true,
            categoryId: categoryId && categoryId !== "null" ? parseInt(categoryId) : null
        };
        if (coverUrl !== undefined) {
            updateData.coverUrl = coverUrl;
        }
        const project = yield prisma.project.update({
            where: { id: parseInt(id) },
            data: updateData,
        });
        res.json(project);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to update project' });
    }
});
exports.updateProject = updateProject;
// Delete a project
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.project.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete project' });
    }
});
exports.deleteProject = deleteProject;
