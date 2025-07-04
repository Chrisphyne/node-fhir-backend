import { Request, Response } from "express";
import { prisma } from "../app";

// Create Maintenance Record
export const createMaintenanceRecord = async (req: Request, res: Response) => {
  const {
    equipmentId,
    type,
    description,
    cost,
    performedBy,
    date,
    nextDue,
  } = req.body;

  try {
    if (!equipmentId || !type || !description || !performedBy || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const record = await prisma.maintenanceRecord.create({
      data: {
        equipmentId,
        type,
        description,
        cost,
        performedBy,
        date: new Date(date),
        nextDue: nextDue ? new Date(nextDue) : undefined,
      },
    });

    res.status(201).json({ message: "Maintenance record created", data: record });
  } catch (error) {
    console.error("Create Maintenance Record Error:", error);
    res.status(500).json({ message: "Error creating maintenance record" });
  }
};

// Get All Maintenance Records
export const getAllMaintenanceRecords = async (_req: Request, res: Response) => {
  try {
    const records = await prisma.maintenanceRecord.findMany({
      include: { equipment: true },
      orderBy: { date: "desc" },
    });

    res.json({ message: "All maintenance records fetched", data: records });
  } catch (error) {
    console.error("Get All Maintenance Records Error:", error);
    res.status(500).json({ message: "Error fetching maintenance records" });
  }
};

// Get Record By ID
export const getMaintenanceRecordById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const record = await prisma.maintenanceRecord.findUnique({
      where: { id },
      include: { equipment: true },
    });

    if (!record) {
      return res.status(404).json({ message: "Maintenance record not found" });
    }

    res.json({ message: "Maintenance record fetched", data: record });
  } catch (error) {
    console.error("Get Maintenance Record Error:", error);
    res.status(500).json({ message: "Error fetching maintenance record" });
  }
};

// Update Maintenance Record
export const updateMaintenanceRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    type,
    description,
    cost,
    performedBy,
    date,
    nextDue,
  } = req.body;

  try {
    const updated = await prisma.maintenanceRecord.update({
      where: { id },
      data: {
        type,
        description,
        cost,
        performedBy,
        date: date ? new Date(date) : undefined,
        nextDue: nextDue ? new Date(nextDue) : undefined,
      },
    });

    res.json({ message: "Maintenance record updated", data: updated });
  } catch (error) {
    console.error("Update Maintenance Record Error:", error);
    res.status(500).json({ message: "Error updating maintenance record" });
  }
};

// Delete Maintenance Record
export const deleteMaintenanceRecord = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.maintenanceRecord.delete({ where: { id } });
    res.json({ message: "Maintenance record deleted" });
  } catch (error) {
    console.error("Delete Maintenance Record Error:", error);
    res.status(500).json({ message: "Error deleting maintenance record" });
  }
};
