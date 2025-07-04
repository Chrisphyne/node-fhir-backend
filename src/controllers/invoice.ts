import { Request, Response } from "express";
import { prisma } from "../app";

// Create Invoice
export const createInvoice = async (req: Request, res: Response) => {
  const {
    invoiceNumber,
    status,
    patientId,
    organizationId,
    totalAmount,
    currency = "USD",
    dueDate,
    paidAmount = 0,
    paidDate,
    lineItems,
    notes,
  } = req.body;

  if (!invoiceNumber || !status || !patientId || !organizationId || !totalAmount || !dueDate || !lineItems) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        status,
        patientId,
        organizationId,
        totalAmount,
        paidAmount,
        currency,
        dueDate: new Date(dueDate),
        paidDate: paidDate ? new Date(paidDate) : undefined,
        lineItems,
        notes,
      },
    });

    res.status(201).json({ message: "Invoice created", data: invoice });
  } catch (error: any) {
    console.error("Create Invoice Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Invoice number must be unique" });
    }
    res.status(500).json({ message: "Failed to create invoice" });
  }
};

// Get All Invoices
export const getAllInvoices = async (_req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        patient: true,
        organization: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ message: "All invoices fetched", data: invoices });
  } catch (error) {
    console.error("Get All Invoices Error:", error);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};

// Get Invoice by ID
export const getInvoiceById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        patient: true,
        organization: true,
      },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json({ message: "Invoice fetched", data: invoice });
  } catch (error) {
    console.error("Get Invoice Error:", error);
    res.status(500).json({ message: "Failed to fetch invoice" });
  }
};

// Update Invoice
export const updateInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    paidAmount,
    paidDate,
    notes,
    lineItems,
  } = req.body;

  try {
    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status,
        paidAmount,
        paidDate: paidDate ? new Date(paidDate) : undefined,
        notes,
        lineItems,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Invoice updated", data: updated });
  } catch (error) {
    console.error("Update Invoice Error:", error);
    res.status(500).json({ message: "Failed to update invoice" });
  }
};

// Delete Invoice
export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.invoice.delete({ where: { id } });
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    res.status(500).json({ message: "Failed to delete invoice" });
  }
};
