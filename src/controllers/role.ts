import { Request, Response } from "express";
import { prisma } from "../app";

export const createRole = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Role name is required" });
        }

        const newRole = await prisma.role.create({
            data: {
                name,
                description
            }
        });

        res.status(201).json({
            message: "Role created successfully",
            data: newRole
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the role" });
    }
};

export const getAllRoles = async (req: Request, res: Response) => {
    try {
        const roles = await prisma.role.findMany({
            orderBy: {
                id: "desc",
            },
            include: {
                Designation: true,
            },
        });

        res.json({
            message: "All roles fetched successfully",
            data: roles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching roles" });
    }
};

export const getRoleById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const role = await prisma.role.findUnique({
            where: { id: parseInt(id) },
            include: {
                Designation: true,
            },
        });

        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.json({
            message: "Role fetched successfully",
            data: role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the role" });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updatedRole = await prisma.role.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description
            },
        });

        res.json({
            message: "Role updated successfully",
            data: updatedRole
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the role" });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.role.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the role" });
    }
};

export const searchRoleByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const roles = await prisma.role.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive", // Case-insensitive search
                },
            },
        });

        if (roles.length === 0) {
            return res.status(404).json({ message: "No roles found" });
        }

        res.json({
            message: "Roles fetched successfully",
            data: roles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while searching for roles" });
    }
};
