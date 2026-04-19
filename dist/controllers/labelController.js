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
exports.deleteLabel = exports.updateLabel = exports.getLabelById = exports.getAllLabels = exports.createLabel = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const label = yield prisma.label.create({
            data: { name },
        });
        res.status(201).json(label);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to create label' });
    }
});
exports.createLabel = createLabel;
const getAllLabels = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const labels = yield prisma.label.findMany();
        res.status(200).json(labels);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch labels' });
    }
});
exports.getAllLabels = getAllLabels;
const getLabelById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const label = yield prisma.label.findUnique({
            where: { id: Number(id) },
        });
        if (!label) {
            return res.status(404).json({ error: 'Label not found' });
        }
        res.status(200).json(label);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fetch label' });
    }
});
exports.getLabelById = getLabelById;
const updateLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const label = yield prisma.label.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.status(200).json(label);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to update label' });
    }
});
exports.updateLabel = updateLabel;
const deleteLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.label.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to delete label' });
    }
});
exports.deleteLabel = deleteLabel;
