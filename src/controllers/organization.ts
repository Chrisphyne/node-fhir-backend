import { Request, Response } from "express";
import { prisma } from "../app";

// Create Organization
export const createOrganization = async (req: Request, res: Response) => {
  const { identifier, name, type, address, telecom, description } = req.body;

  try {
    if (!identifier || !name) {
      return res.status(400).json({ message: "Identifier and name are required" });
    }

    const newOrg = await prisma.organization.create({
      data: {
        identifier,
        name,
        type,
        address,
        telecom,
        description,
      },
    });

    res.status(201).json({
      message: "Organization created successfully",
      data: newOrg,
    });
  } catch (error: any) {
    console.error("Create Organization Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Organization identifier already exists" });
    }
    res.status(500).json({ message: "An error occurred while creating organization" });
  }
};

// Get All Organizations
export const getAllOrganizations = async (_req: Request, res: Response) => {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "Organizations fetched successfully",
      data: organizations,
    });
  } catch (error) {
    console.error("Get Organizations Error:", error);
    res.status(500).json({ message: "An error occurred while fetching organizations" });
  }
};

// Get Organization By ID
export const getOrganizationById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        userAccess: true,
        practitioners: true,
        patients: true,
        staff: true,
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json({
      message: "Organization fetched successfully",
      data: organization,
    });
  } catch (error) {
    console.error("Get Organization Error:", error);
    res.status(500).json({ message: "An error occurred while fetching organization" });
  }
};

// Update Organization
export const updateOrganization = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, address, telecom, description, active } = req.body;

  try {
    const updatedOrg = await prisma.organization.update({
      where: { id },
      data: {
        name,
        type,
        address,
        telecom,
        description,
        active,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: "Organization updated successfully",
      data: updatedOrg,
    });
  } catch (error) {
    console.error("Update Organization Error:", error);
    res.status(500).json({ message: "An error occurred while updating organization" });
  }
};

// Delete Organization
export const deleteOrganization = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.organization.delete({
      where: { id },
    });

    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Delete Organization Error:", error);
    res.status(500).json({ message: "An error occurred while deleting organization" });
  }
};
