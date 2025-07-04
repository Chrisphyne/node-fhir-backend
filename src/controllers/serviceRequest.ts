import { Request, Response } from "express";
import { prisma } from "../app";

// CREATE
export const createServiceRequest = async (req: Request, res: Response) => {
  const {
    identifier,
    status,
    intent,
    category,
    code,
    priority,
    patientId,
    practitionerId,
    organizationId,
    encounterId,
    reasonCode,
    note,
  } = req.body;

  if (!status || !intent || !code || !patientId || !practitionerId || !organizationId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        identifier,
        status,
        intent,
        category,
        code,
        priority,
        patientId,
        practitionerId,
        organizationId,
        encounterId,
        reasonCode,
        note,
      },
    });

    res.status(201).json({ message: "Service request created", data: serviceRequest });
  } catch (error) {
    console.error("Create ServiceRequest Error:", error);
    res.status(500).json({ message: "Failed to create service request" });
  }
};

// READ ALL
export const getAllServiceRequests = async (_req: Request, res: Response) => {
  try {
    const serviceRequests = await prisma.serviceRequest.findMany({
      include: {
        patient: true,
        practitioner: true,
        organization: true,
        encounter: true,
      },
      orderBy: { authoredOn: "desc" },
    });

    res.json({ message: "All service requests fetched", data: serviceRequests });
  } catch (error) {
    console.error("Get All ServiceRequests Error:", error);
    res.status(500).json({ message: "Failed to fetch service requests" });
  }
};

// READ BY ID
export const getServiceRequestById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        patient: true,
        practitioner: true,
        organization: true,
        encounter: true,
      },
    });

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }

    res.json({ message: "Service request found", data: serviceRequest });
  } catch (error) {
    console.error("Get ServiceRequest Error:", error);
    res.status(500).json({ message: "Failed to fetch service request" });
  }
};

// UPDATE
export const updateServiceRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    intent,
    category,
    code,
    priority,
    encounterId,
    reasonCode,
    note,
  } = req.body;

  try {
    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status,
        intent,
        category,
        code,
        priority,
        encounterId,
        reasonCode,
        note,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Service request updated", data: updated });
  } catch (error) {
    console.error("Update ServiceRequest Error:", error);
    res.status(500).json({ message: "Failed to update service request" });
  }
};

// DELETE
export const deleteServiceRequest = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.serviceRequest.delete({ where: { id } });
    res.json({ message: "Service request deleted successfully" });
  } catch (error) {
    console.error("Delete ServiceRequest Error:", error);
    res.status(500).json({ message: "Failed to delete service request" });
  }
};
