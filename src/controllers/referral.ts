import { Request, Response } from "express";
import { prisma } from "../app";

// Create Referral
export const createReferral = async (req: Request, res: Response) => {
  const {
    identifier,
    status,
    type,
    priority,
    patientId,
    referringPractitionerId,
    receivingPractitionerId,
    referringOrganizationId,
    receivingOrganizationId,
    reasonCode,
    description,
    requestedService,
    supportingInfo,
  } = req.body;

  if (!status || !type || !patientId || !referringPractitionerId || !referringOrganizationId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const referral = await prisma.referral.create({
      data: {
        identifier,
        status,
        type,
        priority,
        patientId,
        referringPractitionerId,
        receivingPractitionerId,
        referringOrganizationId,
        receivingOrganizationId,
        reasonCode,
        description,
        requestedService,
        supportingInfo,
      },
    });

    res.status(201).json({ message: "Referral created", data: referral });
  } catch (error) {
    console.error("Create Referral Error:", error);
    res.status(500).json({ message: "Failed to create referral" });
  }
};

// Get All Referrals
export const getAllReferrals = async (_req: Request, res: Response) => {
  try {
    const referrals = await prisma.referral.findMany({
      include: {
        patient: true,
        referringPractitioner: true,
        receivingPractitioner: true,
        referringOrganization: true,
        // receivingOrganization: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ message: "All referrals fetched", data: referrals });
  } catch (error) {
    console.error("Get All Referrals Error:", error);
    res.status(500).json({ message: "Failed to fetch referrals" });
  }
};

// Get Referral by ID
export const getReferralById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const referral = await prisma.referral.findUnique({
      where: { id },
      include: {
        patient: true,
        referringPractitioner: true,
        receivingPractitioner: true,
        referringOrganization: true,
        // receivingOrganization: true,
      },
    });

    if (!referral) {
      return res.status(404).json({ message: "Referral not found" });
    }

    res.json({ message: "Referral fetched", data: referral });
  } catch (error) {
    console.error("Get Referral Error:", error);
    res.status(500).json({ message: "Failed to fetch referral" });
  }
};

// Update Referral
export const updateReferral = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    type,
    priority,
    receivingPractitionerId,
    receivingOrganizationId,
    reasonCode,
    description,
    requestedService,
    supportingInfo,
  } = req.body;

  try {
    const updated = await prisma.referral.update({
      where: { id },
      data: {
        status,
        type,
        priority,
        receivingPractitionerId,
        receivingOrganizationId,
        reasonCode,
        description,
        requestedService,
        supportingInfo,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Referral updated", data: updated });
  } catch (error) {
    console.error("Update Referral Error:", error);
    res.status(500).json({ message: "Failed to update referral" });
  }
};

// Delete Referral
export const deleteReferral = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.referral.delete({ where: { id } });
    res.json({ message: "Referral deleted successfully" });
  } catch (error) {
    console.error("Delete Referral Error:", error);
    res.status(500).json({ message: "Failed to delete referral" });
  }
};
