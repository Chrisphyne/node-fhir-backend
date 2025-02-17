import { Request, Response } from "express";
import { prisma } from "../app";
import { uploadImage } from "../utils/uploadImage";

export const createRegistry = async (req: Request, res: Response) => {
    const { microservice, url, icon, private_url } = req.body;
    const file = req.file as Express.Multer.File; // Single file upload

    try {
        if (!microservice || !url) {
            return res.status(400).json({ message: "Microservice name and URL are required" });
        }

        // const iconPath = file ? uploadImage(file) : ""; // Store the file path if uploaded

        const newRegistry = await prisma.registry.create({
            data: {
                microservice,
                icon: icon, // Store a single image path as a string
                url,
                private: private_url
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

        //hit private url
        const registriesWithPrivate = await Promise.all(registries.map(async (registry) => {
            const response = await fetch(registry.private + "/api/v1/module");
                 
            if (response.ok) {
                const data = await response.json();
                console.log(data, "data", registry.private);
                let remapRegistry ={
                    ...registry,
                    // private: undefined,
                    // id:undefined,
                    created_at:undefined,
                }
                return {
                    ...remapRegistry,
                    data: data.data,
                };
            } else {
                return null;
            }
        }));

        res.json({
            message: "All registry entries fetched successfully",
            data: registriesWithPrivate,
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
    const { microservice, url, icon, private_url } = req.body;
    const file = req.file as Express.Multer.File;

    try {
        
        const updatedRegistry = await prisma.registry.update({
            where: { id: parseInt(id) },
            data: {
                microservice,
                url,
                icon: icon || undefined, // Update only if a new image is uploaded
                private: private_url,
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
