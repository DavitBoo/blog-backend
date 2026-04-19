"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const techController_1 = require("../controllers/techController");
const router = (0, express_1.Router)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
});
router.get(['/tech', '/.well-known/stack'], limiter, techController_1.getTech);
exports.default = router;
