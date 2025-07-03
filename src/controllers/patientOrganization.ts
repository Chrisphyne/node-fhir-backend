import { Request, Response } from "express";
import { prisma } from "../app";

// Create PatientOrganization
export const createPatientOrganization = async (req: Request, res: Response) => {
  const {
    patientId,
    organizationId,
    relationship,
    status,
    registrationDate,
    lastVisit,
    primaryCare,
  } = req.body;

  try {
    if (!patientId || !organizationId) {
      return res.status(400).json({ message: "Patient ID and Organization ID are required" });
    }

    const newLink = await prisma.patientOrganization.create({
      data: {
        patientId,
        organizationId,
        relationship,
        status: status || "active",
        registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
        lastVisit: lastVisit ? new Date(lastVisit) : undefined,
        primaryCare: primaryCare ?? false,
      },
    });

    res.status(201).json({
      message: "Patient-Organization link created successfully",
      data: newLink,
    });
  } catch (error: any) {
    console.error("Create PatientOrg Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Patient is already linked to this organization",
      });
    }
    res.status(500).json({ message: "An error occurred while linking patient to organization" });
  }
};

// Get All PatientOrganizations
export const getAllPatientOrganizations = async (_req: Request, res: Response) => {
  try {
    const links = await prisma.patientOrganization.findMany({
      include: {
        patient: true,
        organization: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Patient-Organization links fetched successfully",
      data: links,
    });
  } catch (error) {
    console.error("Get PatientOrgs Error:", error);
    res.status(500).json({ message: "An error occurred while fetching patient-organization links" });
  }
};

// Get PatientOrganization by ID
export const getPatientOrganizationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const link = await prisma.patientOrganization.findUnique({
      where: { id },
      include: {
        patient: true,
        organization: true,
      },
    });

    if (!link) {
      return res.status(404).json({ message: "Patient-Organization link not found" });
    }

    res.json({
      message: "Link fetched successfully",
      data: link,
    });
  } catch (error) {
    console.error("Get PatientOrg Error:", error);
    res.status(500).json({ message: "An error occurred while fetching the link" });
  }
};

// Update PatientOrganization
export const updatePatientOrganization = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    relationship,
    status,
    registrationDate,
    lastVisit,
    primaryCare,
  } = req.body;

  try {
    const updatedLink = await prisma.patientOrganization.update({
      where: { id },
      data: {
        relationship,
        status,
        registrationDate: registrationDate ? new Date(registrationDate) : undefined,
        lastVisit: lastVisit ? new Date(lastVisit) : undefined,
        primaryCare,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: "Patient-Organization link updated successfully",
      data: updatedLink,
    });
  } catch (error) {
    console.error("Update PatientOrg Error:", error);
    res.status(500).json({ message: "An error occurred while updating the link" });
  }
};

// Delete PatientOrganization
export const deletePatientOrganization = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.patientOrganization.delete({
      where: { id },
    });

    res.json({ message: "Patient-Organization link deleted successfully" });
  } catch (error) {
    console.error("Delete PatientOrg Error:", error);
    res.status(500).json({ message: "An error occurred while deleting the link" });
  }
};
