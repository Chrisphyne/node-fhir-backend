import { Request, Response } from "express";
import { prisma } from "../app";

// CREATE Appointment
export const createAppointment = async (req: Request, res: Response) => {
  const {
    identifier,
    status,
    serviceType,
    specialty,
    appointmentType,
    reasonCode,
    description,
    start,
    end,
    minutesDuration,
    comment,
    patientId,
    practitionerId,
    organizationId,
  } = req.body;

  try {
    if (!status || !start || !end || !patientId || !practitionerId || !organizationId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        identifier,
        status,
        serviceType,
        specialty,
        appointmentType,
        reasonCode,
        description,
        start: new Date(start),
        end: new Date(end),
        minutesDuration,
        comment,
        patientId,
        practitionerId,
        organizationId,
      },
    });

    res.status(201).json({ message: "Appointment created", data: appointment });
  } catch (error) {
    console.error("Create Appointment Error:", error);
    res.status(500).json({ message: "Error creating appointment" });
  }
};

// READ All Appointments
export const getAllAppointments = async (_req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        practitioner: true,
        organization: true,
        encounters: true,
      },
      orderBy: { start: "desc" },
    });

    res.json({ message: "Appointments fetched", data: appointments });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

// READ Appointment By ID
export const getAppointmentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        practitioner: true,
        organization: true,
        encounters: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment fetched", data: appointment });
  } catch (error) {
    console.error("Get Appointment Error:", error);
    res.status(500).json({ message: "Error fetching appointment" });
  }
};

// UPDATE Appointment
export const updateAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    serviceType,
    specialty,
    appointmentType,
    reasonCode,
    description,
    start,
    end,
    minutesDuration,
    comment,
  } = req.body;

  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        serviceType,
        specialty,
        appointmentType,
        reasonCode,
        description,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        minutesDuration,
        comment,
        updatedAt: new Date(),
      },
    });

    res.json({ message: "Appointment updated", data: appointment });
  } catch (error) {
    console.error("Update Appointment Error:", error);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

// DELETE Appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.appointment.delete({ where: { id } });
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete Appointment Error:", error);
    res.status(500).json({ message: "Error deleting appointment" });
  }
};
