import { Request, Response } from "express";
import { prisma } from "../app";

const bcrypt = require('bcrypt');


interface MulterRequest extends Request {
    files: any[];
}
export const createCounties = async (req: MulterRequest, res: Response) => {
    const { name, code, regionId } = req.body;

    try {
        const newCounty = await prisma.counties.create({
            data: {
                name,
                code,
                regionId: parseInt(regionId), // Ensure the region_id is an integer
            },
        });

        res.status(201).json({
            message: "County created successfully",
            data: newCounty,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the county" });
    }
};


export const getAllCounties = async (req: Request, res: Response) => {
    try {
        const counties = await prisma.counties.findMany({
            orderBy: { id: 'desc' },
            include: {
                region: true, // Include the related Region
                SubCounties: {
                    include: {
                        Division: {
                            include: { Location: true },
                        },
                    },
                },
            },
        });

        res.json({
            message: "All counties fetched successfully",
            data: counties,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching counties" });
    }
};


export const getCountiesById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const counties = await prisma.counties.findUnique({
            where: { id: parseInt(id) },
            include: {
                SubCounties: {
                    include: {
                        Division:{
                            include: {
                                Location: true
                            }
                        }
                    }
                }
            }
            
        });

        if (!counties) {
            return res.status(404).json({ message: 'counties not found' });
        }

        res.json({
            message: "counties fetched successfully",
            data: counties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching counties' });
    }
}

export const updateCounties = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, code, regionId } = req.body;

    try {
        const updatedCounty = await prisma.counties.update({
            where: { id: parseInt(id) },
            data: {
                name,
                code,
                regionId: parseInt(regionId),
            },
        });

        res.json({
            message: "County updated successfully",
            data: updatedCounty,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the county" });
    }
};


export const deleteCounties = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.counties.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting counties' });
    }
}

export const searchCountiesByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const counties = await prisma.counties.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive' // This makes the search case insensitive
                }
            }
        });

        if (counties.length === 0) {
            return res.status(404).json({ message: 'No counties found' });
        }

        res.json({
            message: "counties fetched successfully",
            data: counties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while searching for counties' });
    }
};