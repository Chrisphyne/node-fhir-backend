import { Request, Response } from "express";
import { prisma } from "../app";

// CREATE Encounter
export const createEncounter = async (req: Request, res: Response) => {
  const {
    identifier,
    status,
    class: encounterClass,
    type,
    reasonCode,
    period,
    diagnosis,
    patientId,
    practitionerId,
    organizationId,
    appointmentId,
  } = req.body;

  try {
    if (!status || !encounterClass || !patientId || !practitionerId || !organizationId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const encounter = await prisma.encounter.create({
      data: {
        identifier,
        status,
        class: encounterClass,
        type,
        reasonCode,
        period,
        diagnosis,
        patientId,
        practitionerId,
        organizationId,
        appointmentId,
      },
    });

    res.status(201).json({ message: "Encounter created", data: encounter });
  } catch (error) {
    console.error("Create Encounter Error:", error);
    res.status(500).json({ message: "Error creating encounter" });
  }
};

// READ All Encounters
export const getAllEncounters = async (_req: Request, res: Response) => {
  try {
    const encounters = await prisma.encounter.findMany({
      include: {
        patient: true,
        practitioner: true,
        organization: true,
        appointment: true,
        observations: true,
        serviceRequests: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ message: "Encounters fetched", data: encounters });
  } catch (error) {
    console.error("Get Encounters Error:", error);
    res.status(500).json({ message: "Error fetching encounters" });
  }
};

// READ Encounter by ID
export const getEncounterById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const encounter = await prisma.encounter.findUnique({
      where: { id },
      include: {
        patient: true,
        practitioner: true,
        organization: true,
        appointment: true,
        observations: true,
        serviceRequests: true,
      },
    });

    if (!encounter) {
      return res.status(404).json({ message: "Encounter not found" });
    }

    res.json({ message: "Encounter fetched", data: encounter });
  } catch (error) {
    console.error("Get Encounter Error:", error);
    res.status(500).json({ message: "Error fetching encounter" });
  }
};

// UPDATE Encounter
export const updateEncounter = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    class: encounterClass,
    type,
    reasonCode,
    period,
    diagnosis,
    appointmentId,
  } = req.body;

  try {
    const encounter = await prisma.encounter.update({
      where: { id },
      data: {
        status,
        class: encounterClass,
        type,
        reasonCode,
        period,
        diagnosis,
        appointmentId,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Encounter updated", data: encounter });
  } catch (error) {
    console.error("Update Encounter Error:", error);
    res.status(500).json({ message: "Error updating encounter" });
  }
};

// DELETE Encounter
export const deleteEncounter = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.encounter.delete({ where: { id } });
    res.json({ message: "Encounter deleted successfully" });
  } catch (error) {
    console.error("Delete Encounter Error:", error);
    res.status(500).json({ message: "Error deleting encounter" });
  }
};
