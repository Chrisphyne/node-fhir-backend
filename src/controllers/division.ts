import { Request, Response } from "express";
import { prisma } from "../app";

// Create a new Division
export const createDivision = async (req: Request, res: Response) => {
    const { name, subCountyId } = req.body;

    try {
        const newDivision = await prisma.division.create({
            data: {
                name,
                subCountyId: parseInt(subCountyId),
            },
        });

        res.status(201).json({
            message: "Division created successfully",
            data: newDivision,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while creating the division",
        });
    }
};

// Get all Divisions
export const getAllDivisions = async (req: Request, res: Response) => {
    try {
        const divisions = await prisma.division.findMany({
            include: {
                sub_county: true, // Include related SubCounty
                Location: true, // Include related Locations
            },
        });

        res.json({
            message: "All divisions fetched successfully",
            data: divisions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while fetching divisions",
        });
    }
};

// Get a Division by ID
export const getDivisionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const division = await prisma.division.findUnique({
            where: { id: parseInt(id) },
            include: {
                sub_county: true, // Include related SubCounty
                Location: true, // Include related Locations
            },
        });

        if (!division) {
            return res.status(404).json({
                message: "Division not found",
            });
        }

        res.json({
            message: "Division fetched successfully",
            data: division,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while fetching the division",
        });
    }
};

// Update a Division
export const updateDivision = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, subCountyId } = req.body;

    try {
        const updatedDivision = await prisma.division.update({
            where: { id: parseInt(id) },
            data: {
                name,
                subCountyId: parseInt(subCountyId),
            },
        });

        res.json({
            message: "Division updated successfully",
            data: updatedDivision,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while updating the division",
        });
    }
};

// Delete a Division
export const deleteDivision = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.division.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while deleting the division",
        });
    }
};

// Search Divisions by Name
export const searchDivisionsByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const divisions = await prisma.division.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive", // Case-insensitive search
                },
            },
        });

        if (divisions.length === 0) {
            return res.status(404).json({
                message: "No divisions found",
            });
        }

        res.json({
            message: "Divisions fetched successfully",
            data: divisions,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while searching for divisions",
        });
    }
};
