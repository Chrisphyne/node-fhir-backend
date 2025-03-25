import { Request, Response } from "express";
import { prisma } from "../app";

// Create a new health detail
export const createHealthDetail = async (req: Request, res: Response) => {
    const { blood_group, health_insurance_number, injury_type, officerId } = req.body;

    try {
        const newHealthDetail = await prisma.health_Details.create({
            data: {
                blood_group,
                health_insurance_number,
                injury_type,
                officerId
            }
        });

        res.status(201).json({
            message: "Health detail created successfully",
            data: newHealthDetail
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the health detail' });
    }
};

// Get all health details
export const getAllHealthDetails = async (req: Request, res: Response) => {
    try {
        const healthDetails = await prisma.health_Details.findMany({
            orderBy: {
                id: 'desc',
            },
            include: {
                officer: true
            }
        });

        res.json({
            message: "All health details fetched successfully",
            data: healthDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching health details' });
    }
};

// Get a health detail by ID
export const getHealthDetailById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const healthDetail = await prisma.health_Details.findUnique({
            where: { id: parseInt(id) },
            include: {
                officer: true
            }
        });

        if (!healthDetail) {
            return res.status(404).json({ message: 'Health detail not found' });
        }

        res.json({
            message: "Health detail fetched successfully",
            data: healthDetail
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the health detail' });
    }
};

// Update a health detail by ID
export const updateHealthDetail = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { blood_group, health_insurance_number, injury_type, officerId } = req.body;

    try {
        const updatedHealthDetail = await prisma.health_Details.update({
            where: { id: parseInt(id) },
            data: {
                blood_group,
                health_insurance_number,
                injury_type,
                officerId
            }
        });

        res.json({
            message: "Health detail updated successfully",
            data: updatedHealthDetail
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the health detail' });
    }
};

// Delete a health detail by ID
export const deleteHealthDetail = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.health_Details.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the health detail' });
    }
};
