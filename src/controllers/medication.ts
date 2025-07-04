import { Request, Response } from "express";
import { prisma } from "../app";

// CREATE Medication
export const createMedication = async (req: Request, res: Response) => {
  const {
    identifier,
    code,
    status = "active",
    manufacturer,
    form,
    ingredient,
    organizationId,
  } = req.body;

  try {
    if (!code || !organizationId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const medication = await prisma.medication.create({
      data: {
        identifier,
        code,
        status,
        manufacturer,
        form,
        ingredient,
        organizationId,
      },
    });

    res.status(201).json({ message: "Medication created", data: medication });
  } catch (error) {
    console.error("Create Medication Error:", error);
    res.status(500).json({ message: "Error creating medication" });
  }
};

// READ All Medications
export const getAllMedications = async (_req: Request, res: Response) => {
  try {
    const medications = await prisma.medication.findMany({
      include: {
        organization: true,
        requests: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ message: "Medications fetched", data: medications });
  } catch (error) {
    console.error("Get Medications Error:", error);
    res.status(500).json({ message: "Error fetching medications" });
  }
};

// READ Medication by ID
export const getMedicationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const medication = await prisma.medication.findUnique({
      where: { id },
      include: {
        organization: true,
        requests: true,
      },
    });

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    res.json({ message: "Medication fetched", data: medication });
  } catch (error) {
    console.error("Get Medication Error:", error);
    res.status(500).json({ message: "Error fetching medication" });
  }
};

// UPDATE Medication
export const updateMedication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    identifier,
    code,
    status,
    manufacturer,
    form,
    ingredient,
  } = req.body;

  try {
    const medication = await prisma.medication.update({
      where: { id },
      data: {
        identifier,
        code,
        status,
        manufacturer,
        form,
        ingredient,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Medication updated", data: medication });
  } catch (error) {
    console.error("Update Medication Error:", error);
    res.status(500).json({ message: "Error updating medication" });
  }
};

// DELETE Medication
export const deleteMedication = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.medication.delete({ where: { id } });
    res.json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error("Delete Medication Error:", error);
    res.status(500).json({ message: "Error deleting medication" });
  }
};
