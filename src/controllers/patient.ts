import { Request, Response } from "express";
import { prisma } from "../app";

// Create Patient
export const createPatient = async (req: Request, res: Response) => {
  const {
    identifier,
    name,
    telecom,
    gender,
    birthDate,
    address,
    maritalStatus,
    contact,
    emergencyContact,
    insuranceInfo,
    active,
  } = req.body;

  try {
    if (!identifier || !name) {
      return res.status(400).json({ message: "Identifier and name are required" });
    }

    const newPatient = await prisma.patient.create({
      data: {
        identifier,
        name,
        telecom,
        gender,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        address,
        maritalStatus,
        contact,
        emergencyContact,
        insuranceInfo,
        active: active ?? true,
      },
    });

    res.status(201).json({
      message: "Patient created successfully",
      data: newPatient,
    });
  } catch (error) {
    console.error("Create Patient Error:", error);
    res.status(500).json({ message: "An error occurred while creating the patient" });
  }
};

// Get All Patients
export const getAllPatients = async (_req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Patients fetched successfully",
      data: patients,
    });
  } catch (error) {
    console.error("Fetch Patients Error:", error);
    res.status(500).json({ message: "An error occurred while fetching patients" });
  }
};

// Get Patient by ID
export const getPatientById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        organizations: true,
        appointments: true,
        referrals: true,
        encounters: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({
      message: "Patient fetched successfully",
      data: patient,
    });
  } catch (error) {
    console.error("Fetch Patient Error:", error);
    res.status(500).json({ message: "An error occurred while fetching the patient" });
  }
};

// Update Patient
export const updatePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    identifier,
    name,
    telecom,
    gender,
    birthDate,
    address,
    maritalStatus,
    contact,
    emergencyContact,
    insuranceInfo,
    active,
  } = req.body;

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        identifier,
        name,
        telecom,
        gender,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        address,
        maritalStatus,
        contact,
        emergencyContact,
        insuranceInfo,
        active,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Update Patient Error:", error);
    res.status(500).json({ message: "An error occurred while updating the patient" });
  }
};

// Delete Patient
export const deletePatient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.patient.delete({
      where: { id },
    });

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Delete Patient Error:", error);
    res.status(500).json({ message: "An error occurred while deleting the patient" });
  }
};
