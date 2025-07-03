import { Request, Response } from "express";
import { prisma } from "../app";

// Create Practitioner
export const createPractitioner = async (req: Request, res: Response) => {
  const {
    identifier,
    name,
    telecom,
    address,
    gender,
    birthDate,
    qualification,
    specialty,
    licenseNumber,
    active,
  } = req.body;

  try {
    if (!identifier || !name) {
      return res.status(400).json({ message: "Identifier and name are required" });
    }

    const newPractitioner = await prisma.practitioner.create({
      data: {
        identifier,
        name,
        telecom,
        address,
        gender,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        qualification,
        specialty,
        licenseNumber,
        active: active ?? true,
      },
    });

    res.status(201).json({
      message: "Practitioner created successfully",
      data: newPractitioner,
    });
  } catch (error) {
    console.error("Create Practitioner Error:", error);
    res.status(500).json({ message: "An error occurred while creating practitioner" });
  }
};

// Get All Practitioners
export const getAllPractitioners = async (_req: Request, res: Response) => {
  try {
    const practitioners = await prisma.practitioner.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Practitioners fetched successfully",
      data: practitioners,
    });
  } catch (error) {
    console.error("Get Practitioners Error:", error);
    res.status(500).json({ message: "An error occurred while fetching practitioners" });
  }
};

// Get Practitioner By ID
export const getPractitionerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const practitioner = await prisma.practitioner.findUnique({
      where: { id },
      include: {
        organizations: true,
        referralsGiven: true,
        referralsReceived: true,
      },
    });

    if (!practitioner) {
      return res.status(404).json({ message: "Practitioner not found" });
    }

    res.json({
      message: "Practitioner fetched successfully",
      data: practitioner,
    });
  } catch (error) {
    console.error("Get Practitioner Error:", error);
    res.status(500).json({ message: "An error occurred while fetching practitioner" });
  }
};

// Update Practitioner
export const updatePractitioner = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    identifier,
    name,
    telecom,
    address,
    gender,
    birthDate,
    qualification,
    specialty,
    licenseNumber,
    active,
  } = req.body;

  try {
    const updatedPractitioner = await prisma.practitioner.update({
      where: { id },
      data: {
        identifier,
        name,
        telecom,
        address,
        gender,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        qualification,
        specialty,
        licenseNumber,
        active,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: "Practitioner updated successfully",
      data: updatedPractitioner,
    });
  } catch (error) {
    console.error("Update Practitioner Error:", error);
    res.status(500).json({ message: "An error occurred while updating practitioner" });
  }
};

// Delete Practitioner
export const deletePractitioner = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.practitioner.delete({
      where: { id },
    });

    res.json({ message: "Practitioner deleted successfully" });
  } catch (error) {
    console.error("Delete Practitioner Error:", error);
    res.status(500).json({ message: "An error occurred while deleting practitioner" });
  }
};
