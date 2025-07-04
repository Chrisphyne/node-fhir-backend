import { Request, Response } from "express";
import { prisma } from "../app";

// Create Audit Log (Usually from internal event)
export const createAuditLog = async (req: Request, res: Response) => {
  const {
    userId,
    organizationId,
    resourceType,
    resourceId,
    action,
    changes,
    ipAddress,
    userAgent,
  } = req.body;

  if (!resourceType || !resourceId || !action) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const audit = await prisma.auditLog.create({
      data: {
        userId,
        organizationId,
        resourceType,
        resourceId,
        action,
        changes,
        ipAddress: ipAddress || req.ip,
        userAgent: userAgent || req.headers["user-agent"] || "unknown",
      },
    });

    res.status(201).json({ message: "Audit log created", data: audit });
  } catch (error) {
    console.error("Create AuditLog Error:", error);
    res.status(500).json({ message: "Failed to create audit log" });
  }
};

// Get All Audit Logs (can be filtered by query)
export const getAllAuditLogs = async (req: Request, res: Response) => {
  try {
    const { userId, organizationId, resourceType, action } = req.query;

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        userId: userId ? String(userId) : undefined,
        organizationId: organizationId ? String(organizationId) : undefined,
        resourceType: resourceType ? String(resourceType) : undefined,
        action: action ? String(action) : undefined,
      },
      include: {
        user: true,
        organization: true,
      },
      orderBy: { timestamp: "desc" },
    });

    res.json({ message: "Audit logs fetched", data: auditLogs });
  } catch (error) {
    console.error("Get AuditLogs Error:", error);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};

// Get Single Audit Log by ID
export const getAuditLogById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: true,
        organization: true,
      },
    });

    if (!log) return res.status(404).json({ message: "Audit log not found" });

    res.json({ message: "Audit log fetched", data: log });
  } catch (error) {
    console.error("Get AuditLog Error:", error);
    res.status(500).json({ message: "Failed to fetch audit log" });
  }
};

// ⚠️ Optional Admin: Delete Log
export const deleteAuditLog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.auditLog.delete({ where: { id } });
    res.json({ message: "Audit log deleted" });
  } catch (error) {
    console.error("Delete AuditLog Error:", error);
    res.status(500).json({ message: "Failed to delete audit log" });
  }
};
