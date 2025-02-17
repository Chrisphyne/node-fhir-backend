import { Request, Response } from "express";
import { prisma } from "../app";
// import bcrypt from "bcrypt";
// import { searchIPRSPerson } from "../service/search_iprs";

declare global {
    namespace Express {
        interface Officer {
            designation?: any;  // Or use proper Designation type from your Prisma schema
        }
    }
}


// Create a new designation (Assign Role)
export const createDesignation = async (req: Request, res: Response) => {
    const { officerId, roleId, countiesId } = req.body;

    try {
        if (!officerId || !roleId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newDesignation = await prisma.designation.create({
            data: {
                officerId: Number(officerId),
                roleId: Number(roleId),
                countiesId: countiesId ? Number(countiesId) : null,
            },
        });

        res.status(201).json({
            message: "Role assigned successfully",
            data: newDesignation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while assigning the role" });
    }
};

// Get all designations
export const getAllDesignations = async (_req: Request, res: Response) => {
    try {
        const designations = await prisma.designation.findMany({
            include: {
                officer: true,
                role: true,
                county: true,
            },
        });

        res.status(200).json({
            message: "Assigned roles retrieved successfully",
            data: designations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving assigned roles" });
    }
};

// Get a single designation by ID
export const getDesignationById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const designation = await prisma.designation.findUnique({
            where: { id: Number(id) },
            include: {
                officer: true,
                role: true,
                county: true,
            },
        });

        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }

        res.status(200).json({
            message: "Designation retrieved successfully",
            data: designation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving the designation" });
    }
};

// Update a designation by ID
export const updateDesignation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { officerId, roleId, countiesId } = req.body;

    try {
        const existingDesignation = await prisma.designation.findUnique({
            where: { id: Number(id) },
        });

        if (!existingDesignation) {
            return res.status(404).json({ message: "Designation not found" });
        }

        const updatedDesignation = await prisma.designation.update({
            where: { id: Number(id) },
            data: {
                officerId: officerId ? Number(officerId) : existingDesignation.officerId,
                roleId: roleId ? Number(roleId) : existingDesignation.roleId,
                countiesId: countiesId !== undefined ? Number(countiesId) : existingDesignation.countiesId,
            },
        });

        res.status(200).json({
            message: "Designation updated successfully",
            data: updatedDesignation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the designation" });
    }
};

// Delete a designation by ID
export const deleteDesignation = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const existingDesignation = await prisma.designation.findUnique({
            where: { id: Number(id) },
        });

        if (!existingDesignation) {
            return res.status(404).json({ message: "Designation not found" });
        }

        await prisma.designation.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: "Designation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the designation" });
    }
};
