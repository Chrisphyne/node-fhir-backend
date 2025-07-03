import { Request, Response } from "express";
import { prisma } from "../app";

// Create PractitionerOrganization
export const createPractitionerOrganization = async (req: Request, res: Response) => {
  const {
    practitionerId,
    organizationId,
    role,
    status,
    startDate,
    endDate,
    permissions,
  } = req.body;

  try {
    if (!practitionerId || !organizationId) {
      return res.status(400).json({ message: "Practitioner ID and Organization ID are required" });
    }

    const newLink = await prisma.practitionerOrganization.create({
      data: {
        practitionerId,
        organizationId,
        role,
        status: status || "active",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : undefined,
        permissions,
      },
    });

    res.status(201).json({
      message: "Practitioner-Organization link created successfully",
      data: newLink,
    });
  } catch (error: any) {
    console.error("Create Link Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Practitioner already linked to this organization",
      });
    }
    return res.status(500).json({ message: "An error occurred while linking practitioner to organization" });
  }
};

// Get All PractitionerOrganization Links
export const getAllPractitionerOrganizations = async (_req: Request, res: Response) => {
  try {
    const links = await prisma.practitionerOrganization.findMany({
      include: {
        practitioner: true,
        organization: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Practitioner-Organization links fetched successfully",
      data: links,
    });
  } catch (error) {
    console.error("Get Links Error:", error);
    res.status(500).json({ message: "An error occurred while fetching links" });
  }
};

// Get PractitionerOrganization By ID
export const getPractitionerOrganizationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const link = await prisma.practitionerOrganization.findUnique({
      where: { id },
      include: {
        practitioner: true,
        organization: true,
      },
    });

    if (!link) {
      return res.status(404).json({ message: "Practitioner-Organization link not found" });
    }

    res.json({
      message: "Link fetched successfully",
      data: link,
    });
  } catch (error) {
    console.error("Get Link Error:", error);
    res.status(500).json({ message: "An error occurred while fetching the link" });
  }
};

// Update PractitionerOrganization
export const updatePractitionerOrganization = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    role,
    status,
    startDate,
    endDate,
    permissions,
  } = req.body;

  try {
    const updatedLink = await prisma.practitionerOrganization.update({
      where: { id },
      data: {
        role,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        permissions,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: "Link updated successfully",
      data: updatedLink,
    });
  } catch (error) {
    console.error("Update Link Error:", error);
    res.status(500).json({ message: "An error occurred while updating the link" });
  }
};

// Delete PractitionerOrganization
export const deletePractitionerOrganization = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.practitionerOrganization.delete({
      where: { id },
    });

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Delete Link Error:", error);
    res.status(500).json({ message: "An error occurred while deleting the link" });
  }
};
