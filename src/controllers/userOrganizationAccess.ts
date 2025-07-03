import { Request, Response } from "express";
import { prisma } from "../app";

// Create Access Record
export const createUserOrganizationAccess = async (req: Request, res: Response) => {
  const { userId, organizationId, role, permissions, status } = req.body;

  try {
    if (!userId || !organizationId || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const access = await prisma.userOrganizationAccess.create({
      data: {
        userId,
        organizationId,
        role,
        permissions,
        status: status || "active",
      },
    });

    return res.status(201).json({
      message: "User organization access created successfully",
      data: access,
    });
  } catch (error: any) {
    console.error("Create UserOrganizationAccess Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Access already exists for this user and organization",
      });
    }
    return res.status(500).json({ message: "An error occurred while creating access" });
  }
};

// Get All Access Records
export const getAllUserOrganizationAccess = async (_req: Request, res: Response) => {
  try {
    const accesses = await prisma.userOrganizationAccess.findMany({
      include: {
        user: true,
        organization: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ message: "Access records fetched successfully", data: accesses });
  } catch (error) {
    console.error("Fetch All Access Error:", error);
    res.status(500).json({ message: "An error occurred while fetching access records" });
  }
};

// Get Access Record by ID
export const getUserOrganizationAccessById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const access = await prisma.userOrganizationAccess.findUnique({
      where: { id },
      include: {
        user: true,
        organization: true,
      },
    });

    if (!access) {
      return res.status(404).json({ message: "Access record not found" });
    }

    res.json({ message: "Access record fetched successfully", data: access });
  } catch (error) {
    console.error("Fetch Access by ID Error:", error);
    res.status(500).json({ message: "An error occurred while fetching access record" });
  }
};

// Update Access Record
export const updateUserOrganizationAccess = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, permissions, status } = req.body;

  try {
    const access = await prisma.userOrganizationAccess.update({
      where: { id },
      data: {
        role,
        permissions,
        status,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Access record updated successfully", data: access });
  } catch (error) {
    console.error("Update Access Error:", error);
    res.status(500).json({ message: "An error occurred while updating access record" });
  }
};

// Delete Access Record
export const deleteUserOrganizationAccess = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.userOrganizationAccess.delete({
      where: { id },
    });

    res.json({ message: "Access record deleted successfully" });
  } catch (error) {
    console.error("Delete Access Error:", error);
    res.status(500).json({ message: "An error occurred while deleting access record" });
  }
};
