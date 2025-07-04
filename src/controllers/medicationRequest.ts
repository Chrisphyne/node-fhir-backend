import { Request, Response } from "express";
import { prisma } from "../app";

// CREATE MedicationRequest
export const createMedicationRequest = async (req: Request, res: Response) => {
  const {
    identifier,
    status,
    intent,
    medicationReference,
    medicationCodeable,
    patientId,
    practitionerId,
    organizationId,
    reasonCode,
    dosageInstruction,
    dispenseRequest,
  } = req.body;

  try {
    if (!status || !intent || !patientId || !practitionerId || !organizationId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const medicationRequest = await prisma.medicationRequest.create({
      data: {
        identifier,
        status,
        intent,
        medicationReference,
        medicationCodeable,
        patientId,
        practitionerId,
        organizationId,
        reasonCode,
        dosageInstruction,
        dispenseRequest,
      },
    });

    res.status(201).json({ message: "Medication request created", data: medicationRequest });
  } catch (error) {
    console.error("Create MedicationRequest Error:", error);
    res.status(500).json({ message: "Error creating medication request" });
  }
};

// READ All MedicationRequests
export const getAllMedicationRequests = async (_req: Request, res: Response) => {
  try {
    const medicationRequests = await prisma.medicationRequest.findMany({
      include: {
        patient: true,
        practitioner: true,
        organization: true,
        medication: true,
      },
      orderBy: { authoredOn: "desc" },
    });

    res.json({ message: "Medication requests fetched", data: medicationRequests });
  } catch (error) {
    console.error("Get MedicationRequests Error:", error);
    res.status(500).json({ message: "Error fetching medication requests" });
  }
};

// READ MedicationRequest by ID
export const getMedicationRequestById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const medicationRequest = await prisma.medicationRequest.findUnique({
      where: { id },
      include: {
        patient: true,
        practitioner: true,
        organization: true,
        medication: true,
      },
    });

    if (!medicationRequest) {
      return res.status(404).json({ message: "Medication request not found" });
    }

    res.json({ message: "Medication request fetched", data: medicationRequest });
  } catch (error) {
    console.error("Get MedicationRequest Error:", error);
    res.status(500).json({ message: "Error fetching medication request" });
  }
};

// UPDATE MedicationRequest
export const updateMedicationRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    intent,
    medicationReference,
    medicationCodeable,
    reasonCode,
    dosageInstruction,
    dispenseRequest,
  } = req.body;

  try {
    const medicationRequest = await prisma.medicationRequest.update({
      where: { id },
      data: {
        status,
        intent,
        medicationReference,
        medicationCodeable,
        reasonCode,
        dosageInstruction,
        dispenseRequest,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Medication request updated", data: medicationRequest });
  } catch (error) {
    console.error("Update MedicationRequest Error:", error);
    res.status(500).json({ message: "Error updating medication request" });
  }
};

// DELETE MedicationRequest
export const deleteMedicationRequest = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.medicationRequest.delete({ where: { id } });
    res.json({ message: "Medication request deleted successfully" });
  } catch (error) {
    console.error("Delete MedicationRequest Error:", error);
    res.status(500).json({ message: "Error deleting medication request" });
  }
};
