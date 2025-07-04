import { Request, Response } from "express";
import { prisma } from "../app";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";

// Create User
export const createUser = async (req: Request, res: Response) => {
  const { email, password, role, primaryOrganizationId } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        primaryOrganizationId,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      data: { ...newUser, passwordHash: undefined },
    });
  } catch (error: any) {
    console.error("Create User Error:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "An error occurred while creating user" });
  }
};

// Get All Users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { 
        organizationAccess: true, 
        auditLogs: true,
        primaryOrganization: true // Include primary organization details
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ message: "All users fetched successfully", data: users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};

// Get User By ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { organizationAccess: true, auditLogs: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User fetched successfully", data: user });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: "An error occurred while fetching the user" });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, role, primaryOrganizationId, active } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        role,
        primaryOrganizationId,
        active,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "An error occurred while updating the user" });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({ where: { id } });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "An error occurred while deleting the user" });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { 
        sub: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience,
      }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const { passwordHash, ...userData } = user;

    res.json({ message: "Login successful", data: { token, user: userData } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// Reset Password
export const resetUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { passwordHash: hashed },
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "An error occurred while resetting the password" });
  }
};
