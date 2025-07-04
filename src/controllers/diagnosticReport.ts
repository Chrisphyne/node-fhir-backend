import { Request, Response } from "express";
import { prisma } from "../app";

// Create Diagnostic Report
export const createDiagnosticReport = async (req: Request, res: Response) => {
  const {
    identifier,
    status,
    category,
    code,
    patientId,
    effectiveDateTime,
    result,
    conclusion,
    organizationId,
  } = req.body;

  if (!status || !code || !patientId || !organizationId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const report = await prisma.diagnosticReport.create({
      data: {
        identifier,
        status,
        category,
        code,
        patientId,
        effectiveDateTime,
        result,
        conclusion,
        organizationId,
      },
    });

    res.status(201).json({ message: "Diagnostic report created", data: report });
  } catch (error) {
    console.error("Create DiagnosticReport Error:", error);
    res.status(500).json({ message: "Failed to create diagnostic report" });
  }
};

// Get All Diagnostic Reports
export const getAllDiagnosticReports = async (_req: Request, res: Response) => {
  try {
    const reports = await prisma.diagnosticReport.findMany({
      include: {
        patient: true,
        organization: true,
      },
      orderBy: { issued: "desc" },
    });

    res.json({ message: "All diagnostic reports fetched", data: reports });
  } catch (error) {
    console.error("Get All DiagnosticReports Error:", error);
    res.status(500).json({ message: "Failed to fetch diagnostic reports" });
  }
};

// Get Diagnostic Report by ID
export const getDiagnosticReportById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const report = await prisma.diagnosticReport.findUnique({
      where: { id },
      include: {
        patient: true,
        organization: true,
      },
    });

    if (!report) {
      return res.status(404).json({ message: "Diagnostic report not found" });
    }

    res.json({ message: "Diagnostic report fetched", data: report });
  } catch (error) {
    console.error("Get DiagnosticReport Error:", error);
    res.status(500).json({ message: "Failed to fetch diagnostic report" });
  }
};

// Update Diagnostic Report
export const updateDiagnosticReport = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    category,
    code,
    effectiveDateTime,
    result,
    conclusion,
  } = req.body;

  try {
    const updated = await prisma.diagnosticReport.update({
      where: { id },
      data: {
        status,
        category,
        code,
        effectiveDateTime,
        result,
        conclusion,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Diagnostic report updated", data: updated });
  } catch (error) {
    console.error("Update DiagnosticReport Error:", error);
    res.status(500).json({ message: "Failed to update diagnostic report" });
  }
};

// Delete Diagnostic Report
export const deleteDiagnosticReport = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.diagnosticReport.delete({ where: { id } });
    res.json({ message: "Diagnostic report deleted successfully" });
  } catch (error) {
    console.error("Delete DiagnosticReport Error:", error);
    res.status(500).json({ message: "Failed to delete diagnostic report" });
  }
};
