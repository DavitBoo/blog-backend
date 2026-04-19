"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("./config/passport"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const labelRoutes_1 = __importDefault(require("./routes/labelRoutes"));
const techRoutes_1 = __importDefault(require("./routes/techRoutes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const projectCategoryRoutes_1 = __importDefault(require("./routes/projectCategoryRoutes"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    if (process.env.ENABLE_STACK_HINT === '1') {
        res.setHeader('X-Stack-Hint', '🛠️ Pista: visita /tech');
    }
    next();
});
app.use(passport_1.default.initialize()); // initializes passport before use it   
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/users', userRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
app.use('/api/labels', labelRoutes_1.default);
app.use('/api/media', mediaRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
app.use('/api/project-categories', projectCategoryRoutes_1.default);
app.use(techRoutes_1.default);
exports.default = app;
