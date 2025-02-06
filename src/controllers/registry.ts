import { Request, Response } from "express";
import { prisma } from "../app";
import { uploadImage } from "../utils/uploadImage";

export const createRegistry = async (req: Request, res: Response) => {
    const { microservice, url } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
        if (!microservice || !url) {
            return res.status(400).json({ message: "Microservice name and URL are required" });
        }

        const iconPaths = files.map(file => uploadImage(file)); // Save image paths

        const newRegistry = await prisma.registry.create({
            data: {
                microservice,
                icon: iconPaths, // Store multiple image paths
                url,
            },
        });

        res.status(201).json({
            message: "Registry entry created successfully",
            data: newRegistry,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the registry entry" });
    }
};

export const getAllRegistries = async (req: Request, res: Response) => {
    try {
        const registries = await prisma.registry.findMany({
            orderBy: {
                id: "desc",
            },
        });

        res.json({
            message: "All registry entries fetched successfully",
            data: registries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching registry entries" });
    }
};

export const getRegistryById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const registry = await prisma.registry.findUnique({
            where: { id: parseInt(id) },
        });

        if (!registry) {
            return res.status(404).json({ message: "Registry entry not found" });
        }

        res.json({
            message: "Registry entry fetched successfully",
            data: registry,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the registry entry" });
    }
};

export const updateRegistry = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { microservice, url } = req.body;
    const files = req.files as Express.Multer.File[];

    try {
        const iconPaths = files.length ? files.map(file => uploadImage(file)) : undefined;

        const updatedRegistry = await prisma.registry.update({
            where: { id: parseInt(id) },
            data: {
                microservice,
                url,
                icon: iconPaths || undefined, // Only update icon if new files are uploaded
            },
        });

        res.json({
            message: "Registry entry updated successfully",
            data: updatedRegistry,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the registry entry" });
    }
};

export const deleteRegistry = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.registry.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the registry entry" });
    }
};
