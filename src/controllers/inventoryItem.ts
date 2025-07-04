import { Request, Response } from "express";
import { prisma } from "../app";

// Create Inventory Item
export const createInventoryItem = async (req: Request, res: Response) => {
  const {
    name,
    category,
    sku,
    description,
    unitOfMeasure,
    currentStock,
    minimumStock,
    maximumStock,
    unitCost,
    supplier,
    expirationDate,
    organizationId,
  } = req.body;

  try {
    if (!name || !category || !unitOfMeasure || !organizationId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        sku,
        description,
        unitOfMeasure,
        currentStock: currentStock ?? 0,
        minimumStock: minimumStock ?? 0,
        maximumStock,
        unitCost,
        supplier,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
        organizationId,
      },
    });

    res.status(201).json({ message: "Inventory item created", data: item });
  } catch (error: any) {
    console.error("Create Inventory Item Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "SKU already exists" });
    }
    res.status(500).json({ message: "Error creating inventory item" });
  }
};

// Get All Inventory Items
export const getAllInventoryItems = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: { organization: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ message: "All inventory items fetched", data: items });
  } catch (error) {
    console.error("Get Inventory Items Error:", error);
    res.status(500).json({ message: "Error fetching inventory items" });
  }
};

// Get Inventory Item By ID
export const getInventoryItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { organization: true, transactions: true },
    });

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Inventory item fetched", data: item });
  } catch (error) {
    console.error("Get Inventory Item Error:", error);
    res.status(500).json({ message: "Error fetching inventory item" });
  }
};

// Update Inventory Item
export const updateInventoryItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    category,
    sku,
    description,
    unitOfMeasure,
    currentStock,
    minimumStock,
    maximumStock,
    unitCost,
    supplier,
    expirationDate,
  } = req.body;

  try {
    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name,
        category,
        sku,
        description,
        unitOfMeasure,
        currentStock,
        minimumStock,
        maximumStock,
        unitCost,
        supplier,
        expirationDate: expirationDate ? new Date(expirationDate) : undefined,
      },
    });

    res.json({ message: "Inventory item updated", data: updatedItem });
  } catch (error) {
    console.error("Update Inventory Item Error:", error);
    res.status(500).json({ message: "Error updating inventory item" });
  }
};

// Delete Inventory Item
export const deleteInventoryItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.inventoryItem.delete({ where: { id } });
    res.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error("Delete Inventory Item Error:", error);
    res.status(500).json({ message: "Error deleting inventory item" });
  }
};
