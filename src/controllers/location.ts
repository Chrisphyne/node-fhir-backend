import { Request, Response } from "express";
import { prisma } from "../app";

export const createlocation = async (req: Request, res: Response) => {
    const { name,  divisionId } = req.body;

    try {
        const newlocation = await prisma.location.create({
            data: {
                name: name,
                divisionId: divisionId,
            }
        });

        res.status(201).json({
            message: "location created successfully",
            data: newlocation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating location' });
    }
}

export const getAllLocation = async (req: Request, res: Response) => {
    try {
        const location = await prisma.location.findMany({
            orderBy: {
                id: 'desc',
            },
            include: {
                division: true, // Include related  data
            }
        });

        res.json({
            message: "All location fetched successfully",
            data: location
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching location' });
    }
}

export const getlocationById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const location = await prisma.location.findUnique({
            where: { id: parseInt(id) },
            include: {
                division: true, // Include related  data
            }
        });

        if (!location) {
            return res.status(404).json({ message: 'location not found' });
        }

        res.json({
            message: "location fetched successfully",
            data: location
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching location' });
    }
}

export const updatelocation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name,  divisionId } = req.body;

    try {
        const updatedlocation = await prisma.location.update({
            where: { id: parseInt(id) },
            data: {
                name: name,
                divisionId: divisionId,
            }
        });

        res.json({
            message: "location updated successfully",
            data: updatedlocation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating location' });
    }
}

export const deletelocation = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.location.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting location' });
    }
}

export const searchLocationByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const location = await prisma.location.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            include: {
                division: true, // Include related  data
            }
        });

        if (location.length === 0) {
            return res.status(404).json({ message: 'No location found' });
        }

        res.json({
            message: "Location fetched successfully",
            data: location
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while searching for location' });
    }
};
