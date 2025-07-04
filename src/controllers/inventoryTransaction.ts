import { Request, Response } from "express";
import { prisma } from "../app";

// Create Inventory Transaction
export const createInventoryTransaction = async (req: Request, res: Response) => {
  const { itemId, type, quantity, reason, reference, performedBy, date, notes } = req.body;

  try {
    if (!itemId || !type || quantity == null || !performedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    let newStock = item.currentStock;
    if (type === "in") {
      newStock += quantity;
    } else if (type === "out") {
      if (quantity > item.currentStock) {
        return res.status(400).json({ message: "Insufficient stock for this transaction" });
      }
      newStock -= quantity;
    } else if (type === "adjustment") {
      newStock = quantity;
    } else {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    const transaction = await prisma.inventoryTransaction.create({
      data: {
        itemId,
        type,
        quantity,
        reason,
        reference,
        performedBy,
        date: date ? new Date(date) : new Date(),
        notes,
      },
    });

    // Update inventory stock
    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { currentStock: newStock, updatedAt: new Date() },
    });

    res.status(201).json({ message: "Transaction recorded successfully", data: transaction });
  } catch (error) {
    console.error("Create Transaction Error:", error);
    res.status(500).json({ message: "Error creating transaction" });
  }
};

// Get All Transactions
export const getAllInventoryTransactions = async (_req: Request, res: Response) => {
  try {
    const transactions = await prisma.inventoryTransaction.findMany({
      include: { item: true },
      orderBy: { date: "desc" },
    });

    res.json({ message: "All transactions fetched", data: transactions });
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

// Get Transaction by ID
export const getInventoryTransactionById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.inventoryTransaction.findUnique({
      where: { id },
      include: { item: true },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction fetched", data: transaction });
  } catch (error) {
    console.error("Get Transaction Error:", error);
    res.status(500).json({ message: "Error fetching transaction" });
  }
};

// Update Transaction
export const updateInventoryTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { itemId, type, quantity, reason, reference, performedBy, date, notes } = req.body;

  try {
    const transaction = await prisma.inventoryTransaction.findUnique({
      where: { id },
      include: { item: true },
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    let newStock = transaction.item.currentStock;
    if (type === "in") {
        newStock += quantity;
    } else if (type === "out") {
        if (quantity > newStock) {
            return res.status(400).json({ message: "Insufficient stock for this transaction" });
        }
        newStock -= quantity;
    } else if (type === "adjustment") { 
        newStock = quantity;
    } else {
        return res.status(400).json({ message: "Invalid transaction type" });
    }

    await prisma.inventoryTransaction.update({
        where: { id },
        data: {
            itemId,
            type,
            quantity,
            reason, 
            reference,
            performedBy,
            date: date ? new Date(date) : new Date(),
            notes,
        },
    });

    await prisma.inventoryItem.update({
        where: { id: itemId },
        data: { currentStock: newStock, updatedAt: new Date() },
    });

    res.json({ message: "Transaction updated successfully", data: transaction });
  } catch (error) {
    console.error("Update Transaction Error:", error);
    res.status(500).json({ message: "Error updating transaction" });
  }
};

// Delete Transaction   
export const deleteInventoryTransaction = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const transaction = await prisma.inventoryTransaction.delete({
      where: { id },    
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }   

    res.json({ message: "Transaction deleted successfully", data: transaction });
  } catch (error) {
    console.error("Delete Transaction Error:", error);
    res.status(500).json({ message: "Error deleting transaction" });
  }
};

