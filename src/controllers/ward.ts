import { Request, Response } from "express";
import { prisma } from "../app";

// Create a new village
export const createWard = async (req: Request, res: Response) => {
    const { name, locationId } = req.body;

    try {
        const newWard = await prisma.ward.create({
            data: {
                name,
                locationId
            }
        });

        res.status(201).json({
            message: "Ward created successfully",
            data: newWard
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the ward' });
    }
};

// Get all villages
export const getAllWards = async (req: Request, res: Response) => {
    try {
        const wards = await prisma.ward.findMany({
            orderBy: {
                id: 'desc',
            },
            include: {
                location: true
            }
        });

        res.json({
            message: "All wards fetched successfully",
            data: wards
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching wards' });
    }
};

// Get a village by ID
export const getWardById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const ward = await prisma.ward.findUnique({
            where: { id: parseInt(id) },
            include: {
                location: true
            }
        });

        if (!ward) {
            return res.status(404).json({ message: 'Ward not found' });
        }

        res.json({
            message: "Ward fetched successfully",
            data: ward
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the ward' });
    }
};

// Update a ward by ID
export const updateWard = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, locationId } = req.body;

    try {
        const updatedWard = await prisma.ward.update({
            where: { id: parseInt(id) },
            data: {
                name,
                locationId
            }
        });

        res.json({
            message: "Ward updated successfully",
            data: updatedWard
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the ward' });
    }
};

// Delete a ward by ID
export const deleteWard = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.ward.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the ward' });
    }
};
