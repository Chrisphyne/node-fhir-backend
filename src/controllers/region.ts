import { Request, Response } from "express";
import { prisma } from "../app";

export const createRegion = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        const newRegion = await prisma.region.create({
            data: {
                name
            }
        });

        res.status(201).json({
            message: "Region created successfully",
            data: newRegion
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the region" });
    }
};

export const getAllRegions = async (req: Request, res: Response) => {
    try {
        const regions = await prisma.region.findMany({
            orderBy: {
                id: "desc",
            },
            include: {
                Counties: {
                    include: {
                        SubCounties: {
                            include:{
                                Division: {
                                    include:{
                                        Location: {
                                            include:{
                                                Ward: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        res.json({
            message: "All regions fetched successfully", 
            data: regions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching regions" });
    }
};

export const getRegionById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const region = await prisma.region.findUnique({
            where: { id: parseInt(id) },
            include: {
                Counties: true,
            },
        });

        if (!region) {
            return res.status(404).json({ message: "Region not found" });
        }

        res.json({
            message: "Region fetched successfully",
            data: region
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the region" });
    }
};

export const updateRegion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedRegion = await prisma.region.update({
            where: { id: parseInt(id) },
            data: {
                name
            },
        });

        res.json({
            message: "Region updated successfully",
            data: updatedRegion
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the region" });
    }
};

export const deleteRegion = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.region.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the region" });
    }
};

export const searchRegionByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const regions = await prisma.region.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive", // Makes the search case insensitive
                },
            },
        });

        if (regions.length === 0) {
            return res.status(404).json({ message: "No regions found" });
        }

        res.json({
            message: "Regions fetched successfully",
            data: regions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while searching for regions" });
    }
};