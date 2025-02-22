import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLabel = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const label = await prisma.label.create({
            data: { name }, 
        });
        res.status(201).json(label);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create label' });
    }
};

export const getAllLabels = async (_req: Request, res: Response) => {
    try {
        const labels = await prisma.label.findMany();
        res.status(200).json(labels);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch labels' });
    }
};

export const getLabelById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const label = await prisma.label.findUnique({
            where: { id: Number(id) },
        });
        if (!label) {
            return res.status(404).json({ error: 'Label not found' });
        }
        res.status(200).json(label);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch label' });
    }
};

export const updateLabel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const label = await prisma.label.update({
            where: { id: Number(id) },
            data: { name },
        });
        res.status(200).json(label);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update label' });
    }
};

export const deleteLabel = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.label.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete label' });
    }
};
