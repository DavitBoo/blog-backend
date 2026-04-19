"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/mediaRoutes.ts
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const mediaController_1 = require("../controllers/mediaController");
const multer_1 = require("../middlewares/multer");
const router = (0, express_1.Router)();
// Todas las rutas están protegidas con autenticación JWT
router.post("/upload", passport_1.default.authenticate("jwt", { session: false }), multer_1.upload.single("image"), mediaController_1.uploadImage);
router.get("/", passport_1.default.authenticate("jwt", { session: false }), mediaController_1.listImages);
router.get("/:fileName", passport_1.default.authenticate("jwt", { session: false }), mediaController_1.getImage);
router.delete("/:fileName", passport_1.default.authenticate("jwt", { session: false }), mediaController_1.deleteImage);
router.delete("/batch/delete", passport_1.default.authenticate("jwt", { session: false }), mediaController_1.deleteMultipleImages);
exports.default = router;
