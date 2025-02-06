import { Request, Response } from "express";
import { prisma } from "../app";

export const createPoliceStation = async (req: Request, res: Response) => {
    const { name, description, locationId } = req.body;

    try {
        const newPoliceStation = await prisma.policeStation.create({
            data: {
                name,
                description,
                locationId
            }
        });

        res.status(201).json({
            message: "Police Station created successfully",
            data: newPoliceStation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the Police Station" });
    }
};

export const getAllPoliceStations = async (req: Request, res: Response) => {
    try {
        const policeStations = await prisma.policeStation.findMany({
            orderBy: {
                id: "desc",
            },
            include: {
                location: true,
                Officer: true,
            },
        });

        res.json({
            message: "All Police Stations fetched successfully",
            data: policeStations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching Police Stations" });
    }
};

export const getPoliceStationById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const policeStation = await prisma.policeStation.findUnique({
            where: { id: parseInt(id) },
            include: {
                location: true,
                Officer: true,
            },
        });

        if (!policeStation) {
            return res.status(404).json({ message: "Police Station not found" });
        }

        res.json({
            message: "Police Station fetched successfully",
            data: policeStation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the Police Station" });
    }
};

export const updatePoliceStation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, locationId } = req.body;

    try {
        const updatedPoliceStation = await prisma.policeStation.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                locationId
            },
        });

        res.json({
            message: "Police Station updated successfully",
            data: updatedPoliceStation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the Police Station" });
    }
};

export const deletePoliceStation = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.policeStation.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the Police Station" });
    }
};

export const searchPoliceStationByName = async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const policeStations = await prisma.policeStation.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive", // Case-insensitive search
                },
            },
        });

        if (policeStations.length === 0) {
            return res.status(404).json({ message: "No Police Stations found" });
        }

        res.json({
            message: "Police Stations fetched successfully",
            data: policeStations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while searching for Police Stations" });
    }
};