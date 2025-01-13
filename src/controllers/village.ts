import { Request, Response } from "express";
import { prisma } from "../app";

// Create a new village
export const createVillage = async (req: Request, res: Response) => {
    const { name, description, locationId } = req.body;

    try {
        const newVillage = await prisma.village.create({
            data: {
                name,
                description,
                locationId
            }
        });

        res.status(201).json({
            message: "Village created successfully",
            data: newVillage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the village' });
    }
};

// Get all villages
export const getAllVillages = async (req: Request, res: Response) => {
    try {
        const villages = await prisma.village.findMany({
            orderBy: {
                id: 'desc',
            },
            include: {
                location: true
            }
        });

        res.json({
            message: "All villages fetched successfully",
            data: villages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching villages' });
    }
};

// Get a village by ID
export const getVillageById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const village = await prisma.village.findUnique({
            where: { id: parseInt(id) },
            include: {
                location: true
            }
        });

        if (!village) {
            return res.status(404).json({ message: 'Village not found' });
        }

        res.json({
            message: "Village fetched successfully",
            data: village
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the village' });
    }
};

// Update a village by ID
export const updateVillage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, locationId } = req.body;

    try {
        const updatedVillage = await prisma.village.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                locationId
            }
        });

        res.json({
            message: "Village updated successfully",
            data: updatedVillage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the village' });
    }
};

// Delete a village by ID
export const deleteVillage = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.village.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the village' });
    }
};
