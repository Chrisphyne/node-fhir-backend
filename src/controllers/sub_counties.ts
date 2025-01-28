import { Request, Response } from "express";
import { prisma } from "../app";

export const createSubCounty = async (req: Request, res: Response) => {
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    const { name, countyId } = req.body;

    try {
        const newSubCounty = await prisma.subCounty.create({
            data: {
                name: name,
                countyId: countyId,
            }
        });

        res.status(201).json({
            message: "SubCounty created successfully",
            data: newSubCounty
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating subcounty' });
    }
}

export const getAllSubCounties = async (req: Request, res: Response) => {
    try {
        const subCounties = await prisma.subCounty.findMany({
            orderBy: {
                id: 'desc',
            },
            include: {
                county: true, // Include related county data
            }
        });

        res.json({
            message: "All subcounties fetched successfully",
            data: subCounties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching subcounties' });
    }
}

export const getSubCountyById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const subCounty = await prisma.subCounty.findUnique({
            where: { id: parseInt(id) },
            include: {
                county: true, // Include related county data
            }
        });

        if (!subCounty) {
            return res.status(404).json({ message: 'SubCounty not found' });
        }

        res.json({
            message: "SubCounty fetched successfully",
            data: subCounty
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching subcounty' });
    }
}

export const updateSubCounty = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name,  countyId } = req.body;

    try {
        const updatedSubCounty = await prisma.subCounty.update({
            where: { id: parseInt(id) },
            data: {
                name: name,
                countyId: countyId,
            }
        });

        res.json({
            message: "SubCounty updated successfully",
            data: updatedSubCounty
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating subcounty' });
    }
}

export const deleteSubCounty = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.subCounty.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting subcounty' });
    }
}

export const searchSubCountiesByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const subCounties = await prisma.subCounty.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            include: {
                county: true, // Include related county data
            }
        });

        if (subCounties.length === 0) {
            return res.status(404).json({ message: 'No subcounties found' });
        }

        res.json({
            message: "SubCounties fetched successfully",
            data: subCounties
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while searching for location' });
    }
};