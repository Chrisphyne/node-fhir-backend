import { Request, Response } from "express";
import { prisma } from "../app";

// Create Observation
export const createObservation = async (req: Request, res: Response) => {
  const {
    identifier,
    status,
    category,
    code,
    patientId,
    encounterId,
    effectiveDateTime,
    valueQuantity,
    valueCodeableConcept,
    valueString,
    interpretation,
    note,
    organizationId,
  } = req.body;

  if (!status || !code || !patientId || !organizationId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const observation = await prisma.observation.create({
      data: {
        identifier,
        status,
        category,
        code,
        patientId,
        encounterId,
        effectiveDateTime,
        valueQuantity,
        valueCodeableConcept,
        valueString,
        interpretation,
        note,
        organizationId,
      },
    });

    res.status(201).json({ message: "Observation created", data: observation });
  } catch (error) {
    console.error("Create Observation Error:", error);
    res.status(500).json({ message: "Failed to create observation" });
  }
};

// Get All Observations
export const getAllObservations = async (_req: Request, res: Response) => {
  try {
    const observations = await prisma.observation.findMany({
      include: {
        patient: true,
        organization: true,
        encounter: true,
      },
      orderBy: { issued: "desc" },
    });

    res.json({ message: "All observations fetched", data: observations });
  } catch (error) {
    console.error("Get All Observations Error:", error);
    res.status(500).json({ message: "Failed to fetch observations" });
  }
};

// Get Observation by ID
export const getObservationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const observation = await prisma.observation.findUnique({
      where: { id },
      include: {
        patient: true,
        organization: true,
        encounter: true,
      },
    });

    if (!observation) {
      return res.status(404).json({ message: "Observation not found" });
    }

    res.json({ message: "Observation fetched", data: observation });
  } catch (error) {
    console.error("Get Observation Error:", error);
    res.status(500).json({ message: "Failed to fetch observation" });
  }
};

// Update Observation
export const updateObservation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    category,
    code,
    effectiveDateTime,
    valueQuantity,
    valueCodeableConcept,
    valueString,
    interpretation,
    note,
  } = req.body;

  try {
    const updated = await prisma.observation.update({
      where: { id },
      data: {
        status,
        category,
        code,
        effectiveDateTime,
        valueQuantity,
        valueCodeableConcept,
        valueString,
        interpretation,
        note,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Observation updated", data: updated });
  } catch (error) {
    console.error("Update Observation Error:", error);
    res.status(500).json({ message: "Failed to update observation" });
  }
};

// Delete Observation
export const deleteObservation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.observation.delete({ where: { id } });
    res.json({ message: "Observation deleted successfully" });
  } catch (error) {
    console.error("Delete Observation Error:", error);
    res.status(500).json({ message: "Failed to delete observation" });
  }
};
