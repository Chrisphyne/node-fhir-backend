import { Request, Response } from "express";
import { prisma } from "../app";

// Create a new next of kin
export const createNextOfKin = async (req: Request, res: Response) => {
    const { name, relationship, phone_number, officerId } = req.body;

    try {
        const newNextOfKin = await prisma.next_Of_Kin.create({
            data: {
                name,
                relationship,
                phone_number,
                officerId
            }
        });

        res.status(201).json({
            message: "Next of Kin created successfully",
            data: newNextOfKin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the Next of Kin' });
    }
};

// Get all next of kin
export const getAllNextOfKin = async (req: Request, res: Response) => {
    try {
        const nextOfKinList = await prisma.next_Of_Kin.findMany({
            orderBy: {
                id: 'desc',
            },
            include: {
                officer: true
            }
        });

        res.json({
            message: "All Next of Kin fetched successfully",
            data: nextOfKinList
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching Next of Kin' });
    }
};

// Get a next of kin by ID
export const getNextOfKinById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const nextOfKin = await prisma.next_Of_Kin.findUnique({
            where: { id: parseInt(id) },
            include: {
                officer: true
            }
        });

        if (!nextOfKin) {
            return res.status(404).json({ message: 'Next of Kin not found' });
        }

        res.json({
            message: "Next of Kin fetched successfully",
            data: nextOfKin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the Next of Kin' });
    }
};

// Update a next of kin by ID
export const updateNextOfKin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, relationship, phone_number, officerId } = req.body;

    try {
        const updatedNextOfKin = await prisma.next_Of_Kin.update({
            where: { id: parseInt(id) },
            data: {
                name,
                relationship,
                phone_number,
                officerId
            }
        });

        res.json({
            message: "Next of Kin updated successfully",
            data: updatedNextOfKin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the Next of Kin' });
    }
};

// Delete a next of kin by ID
export const deleteNextOfKin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.next_Of_Kin.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the Next of Kin' });
    }
};
