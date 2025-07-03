import { Request, Response } from "express";
import { prisma } from "../app";

// Create Equipment
export const createEquipment = async (req: Request, res: Response) => {
  const {
    name,
    type,
    manufacturer,
    model,
    serialNumber,
    status,
    location,
    purchaseDate,
    warrantyExpiry,
    lastMaintenance,
    nextMaintenance,
    organizationId,
  } = req.body;

  try {
    if (!name || !type || !organizationId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const equipment = await prisma.equipment.create({
      data: {
        name,
        type,
        manufacturer,
        model,
        serialNumber,
        status,
        location,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
        lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : undefined,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : undefined,
        organizationId,
      },
    });

    res.status(201).json({ message: "Equipment created", data: equipment });
  } catch (error: any) {
    console.error("Create Equipment Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Serial number already exists" });
    }
    res.status(500).json({ message: "Error creating equipment" });
  }
};

// Get All Equipment
export const getAllEquipment = async (_req: Request, res: Response) => {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        organization: true,
        maintenanceRecords: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ message: "Equipment list fetched", data: equipment });
  } catch (error) {
    console.error("Get All Equipment Error:", error);
    res.status(500).json({ message: "Error fetching equipment" });
  }
};

// Get Equipment by ID
export const getEquipmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        organization: true,
        maintenanceRecords: true,
      },
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json({ message: "Equipment found", data: equipment });
  } catch (error) {
    console.error("Get Equipment Error:", error);
    res.status(500).json({ message: "Error fetching equipment" });
  }
};

// Update Equipment
export const updateEquipment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    type,
    manufacturer,
    model,
    serialNumber,
    status,
    location,
    purchaseDate,
    warrantyExpiry,
    lastMaintenance,
    nextMaintenance,
    organizationId,
  } = req.body;

  try {
    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        name,
        type,
        manufacturer,
        model,
        serialNumber,
        status,
        location,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
        lastMaintenance: lastMaintenance ? new Date(lastMaintenance) : undefined,
        nextMaintenance: nextMaintenance ? new Date(nextMaintenance) : undefined,
        organizationId,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Equipment updated", data: updated });
  } catch (error) {
    console.error("Update Equipment Error:", error);
    res.status(500).json({ message: "Error updating equipment" });
  }
};

// Delete Equipment
export const deleteEquipment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.equipment.delete({ where: { id } });
    res.json({ message: "Equipment deleted" });
  } catch (error) {
    console.error("Delete Equipment Error:", error);
    res.status(500).json({ message: "Error deleting equipment" });
  }
};
