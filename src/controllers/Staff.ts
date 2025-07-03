import { Request, Response } from "express";
import { prisma } from "../app";
import { StaffPosition, StaffStatus } from "@prisma/client";

// Create Staff
export const createStaff = async (req: Request, res: Response) => {
  const {
    employeeId,
    name,
    position,
    department,
    email,
    phone,
    address,
    hireDate,
    status,
    organizationId,
  } = req.body;

  try {
    if (!employeeId || !name || !position || !organizationId || !hireDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optional: validate enums (you can skip if you trust the input)
    if (!Object.values(StaffPosition).includes(position)) {
      return res.status(400).json({ message: `Invalid position: ${position}` });
    }

    if (status && !Object.values(StaffStatus).includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    const newStaff = await prisma.staff.create({
      data: {
        employeeId,
        name,
        position, // must match StaffPosition enum
        department,
        email,
        phone,
        address,
        hireDate: new Date(hireDate),
        status: status || StaffStatus.ACTIVE, // default to ACTIVE
        organizationId,
      },
    });

    res.status(201).json({
      message: "Staff member created successfully",
      data: newStaff,
    });
  } catch (error: any) {
    console.error("Create Staff Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Employee ID must be unique" });
    }
    res.status(500).json({ message: "An error occurred while creating staff member" });
  }
};


// Get All Staff
export const getAllStaff = async (_req: Request, res: Response) => {
  try {
    const staffList = await prisma.staff.findMany({
      include: { organization: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      message: "All staff members fetched successfully",
      data: staffList,
    });
  } catch (error) {
    console.error("Fetch Staff Error:", error);
    res.status(500).json({ message: "An error occurred while fetching staff members" });
  }
};

// Get Staff by ID
export const getStaffById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({
      message: "Staff member fetched successfully",
      data: staff,
    });
  } catch (error) {
    console.error("Get Staff Error:", error);
    res.status(500).json({ message: "An error occurred while fetching staff member" });
  }
};

// Update Staff
export const updateStaff = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    position,
    department,
    email,
    phone,
    address,
    hireDate,
    status,
    organizationId,
  } = req.body;

  try {
    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: {
        name,
        position,
        department,
        email,
        phone,
        address,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        status,
        organizationId,
        updatedAt: new Date(),
      },
    });

    res.json({
      message: "Staff member updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    console.error("Update Staff Error:", error);
    res.status(500).json({ message: "An error occurred while updating staff member" });
  }
};

// Delete Staff
export const deleteStaff = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.staff.delete({
      where: { id },
    });

    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Delete Staff Error:", error);
    res.status(500).json({ message: "An error occurred while deleting staff member" });
  }
};
