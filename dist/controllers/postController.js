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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getPostsBackEnd = exports.getPostBySlug = exports.getPostById = exports.getPosts = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const slugify_1 = require("../utils/slugify");
const supabase_1 = require("../utils/supabase");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const prisma = new client_1.PrismaClient();
// Get all published posts
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
            where: { published: true },
            include: {
                author: { select: { name: true, email: true } },
                labels: true
            },
        });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
exports.getPosts = getPosts;
// Get a single post by ID
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // admin visits do not count haha
        // await prisma.post.update({
        //   where: { id: Number(id) },
        //   data: { views: { increment: 1 } },
        // });
        const post = yield prisma.post.findUnique({
            where: { id: parseInt(id) },
            include: {
                author: { select: { name: true, email: true } },
                comments: true,
                labels: true,
            },
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch post :((' });
    }
});
exports.getPostById = getPostById;
// get post by slug
const getPostBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const post = yield prisma.post.findFirst({
            where: { slug },
            include: {
                author: { select: { name: true, email: true } },
                comments: true,
                labels: true,
            },
        });
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        yield prisma.post.update({
            where: { id: post.id },
            data: { views: { increment: 1 } },
        });
        res.json([post]); // opcional: o solo `res.json(post)` si prefieres
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching post by slug' });
    }
});
exports.getPostBySlug = getPostBySlug;
// get the post from the backend 
const getPostsBackEnd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma.post.findMany({
            include: { author: { select: { name: true, email: true } } },
        });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts, sí?' });
    }
});
exports.getPostsBackEnd = getPostsBackEnd;
// Create a new post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, content, metaDescription, metaTitle, isPublished } = req.body;
        const labels = JSON.parse(req.body.labels);
        const file = req.file;
        let { id } = req.user;
        let userId = parseInt(id);
        let coverUrl = null;
        if (file) {
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${(0, uuid_1.v4)()}.${fileExt}`;
            // Verificar que el bucket existe
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
                console.error("Error uploading to Supabase:", uploadError.message);
                throw new Error("Error uploading image");
            }
            const { data: publicUrlData } = supabase_1.supabase.storage
                .from("images")
                .getPublicUrl(fileName);
            coverUrl = (_a = publicUrlData === null || publicUrlData === void 0 ? void 0 : publicUrlData.publicUrl) !== null && _a !== void 0 ? _a : null;
        }
        const post = yield prisma.post.create({
            data: {
                title,
                content,
                metaDescription,
                metaTitle,
                slug: (0, slugify_1.slugify)(title),
                published: isPublished === "true",
                coverUrl,
                authorId: userId,
                labels: {
                    connect: labels.map((id) => ({ id: parseInt(id) }))
                }
            },
            include: {
                labels: true,
                author: true
            }
        });
        res.status(201).json(post);
    }
    catch (error) {
        console.error("Error creating post:", error);
        // Solo envía la respuesta si no se ha enviado ya
        if (!res.headersSent) {
            const message = error instanceof Error ? error.message : "Failed to create post";
            res.status(500).json({ error: message });
        }
    }
});
exports.createPost = createPost;
// Update a post
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(req.body);
    const { title, content, metaDescription, metaTitle, isPublished, labels } = req.body;
    try {
        const post = yield prisma.post.update({
            where: { id: parseInt(id) },
            data: { title, content, metaDescription, metaTitle, published: isPublished, labels: {
                    connect: labels.map((id) => ({ id: parseInt(id) }))
                } },
        });
        res.json(post);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update post' });
    }
});
exports.updatePost = updatePost;
// Delete a post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.post.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete post' });
    }
});
exports.deletePost = deletePost;
