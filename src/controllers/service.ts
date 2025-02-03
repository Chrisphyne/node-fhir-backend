import { Request, Response } from "express";
import { prisma } from "../app";

// Create a new village
export const createService = async (req: Request, res: Response) => {
    const { officerId, department, current_assignment } = req.body;

    try {
        const newService = await prisma.service.create({
            data: {
                officerId,
                department,
                current_assignment
            }
        });

        res.status(201).json({
            message: "Service created successfully",
            data: newService
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the service' });
    }
};

// Get all villages
export const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: {
                id: 'desc',
            }
        });

        res.json({
            message: "All services fetched successfully",
            data: services
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching wards' });
    }
};

// Get a village by ID
export const getServiceById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const service = await prisma.service.findUnique({
            where: { id: parseInt(id) },
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({
            message: "Service fetched successfully",
            data: service
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching the service' });
    }
};

// Update a service by ID
export const updateService = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { officerId, department, current_assignment } = req.body;

    try {
        const updatedService = await prisma.service.update({
            where: { id: parseInt(id) },
            data: {
                officerId,
                department,
                current_assignment
            }
        });

        res.json({
            message: "Service updated successfully",
            data: updatedService
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the service' });
    }
};

// Delete a service by ID
export const deleteService = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.service.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the service' });
    }
};
