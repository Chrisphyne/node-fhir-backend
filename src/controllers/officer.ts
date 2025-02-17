import { Request, Response } from "express";
import { JWTSecret, prisma } from "../app";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { searchIPRSPerson } from "../service/search_iprs";

// Configure Nodemailer for email notifications
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "noreply@virtualpolicestation.com",
    pass: "Vps@2023#",
  },
});

export const createOfficer = async (req: Request, res: Response) => {
  const { name, email, id_no, service_number, roleId, badge_number,  stationId, phone_number } = req.body;

  try {
    if (!name || !id_no || !service_number || !roleId || !badge_number || !stationId || !phone_number) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate a one-time temporary password
    const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Fetch or create IPRS_Person using the provided ID number
    const iprsPerson = await searchIPRSPerson(id_no);
    if (!iprsPerson) {
      return res.status(404).json({ message: "IPRS person not found" });
    }

    const fullName = `${iprsPerson.first_name} ${iprsPerson.middle_name || ""} ${iprsPerson.last_name}`.trim();

    const newOfficer = await prisma.officer.create({
      data: {
        name: fullName,
        email,
        phone_number,
        roleId: roleId,
        badge_number,
        stationId: stationId,
        service_number,
        password: hashedPassword,
        is_temporary_password: true,
        iPRS_PersonId: iprsPerson.id,
        created_at: new Date(),
      },
    });

    const mailOptions = {
      from: "noreply@virtualpolicestation.com",
      to: email,
      subject: "Welcome! Your Account Has Been Created",
      text: `Hello ${fullName},\n\nYour account has been created successfully.\nService Number: ${service_number}\nTemporary Password: ${tempPassword}\n\nPlease log in with this temporary password and change it immediately.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email to the new officer" });
      }
      res.status(201).json({
        message: "Officer created successfully and email sent",
        data: newOfficer,
      });
    });
  } catch (error) {
    console.error("Error creating officer:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email or service number already exists" });
    }
    return res.status(500).json({ message: "An error occurred while creating the officer" });
  }
};




// Read All Officers
export const getAllOfficers = async (req: Request, res: Response) => {
    try {
        const officers = await prisma.officer.findMany({
            include: { iprs: true, station: true }, // Include IPRS_Person relationship
            orderBy: { id: 'desc' },
            
        });

        res.json({
            message: "All officers fetched successfully",
            data: officers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching officers" });
    }
};

// Read User by ID
export const getOfficerById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const officer = await prisma.officer.findUnique({
            where: { id: parseInt(id) },
            include: { iprs: true },
        });

        if (!officer) {
            return res.status(404).json({ message: "Officer not found" });
        }

        res.json({
            message: "Officer fetched successfully",
            data: officer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the officer" });
    }
};

// Update Officer
export const updateOfficer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, roleId, badge_number, stationId, phone_number } = req.body;

  try {
    // Check if the user exists
    const existingOfficer = await prisma.officer.findUnique({ where: { id: parseInt(id) } });

    if (!existingOfficer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    // Update IPRS_Person if needed
    // if (iprs && existingUser.iPRS_PersonId) {
    //   await prisma.iPRS_Person.update({
    //     where: { id: existingUser.iPRS_PersonId },
    //     data: {
    //       ...iprs,
    //       date_of_birth: iprs.date_of_birth ? new Date(iprs.date_of_birth) : undefined,
    //     },
    //   });
    // }

    // Update Officer
    const updatedOfficer = await prisma.officer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone_number,
        roleId,
        badge_number,
        stationId: stationId,
      },
    });

    res.json({
      message: "Officer updated successfully",
      data: updatedOfficer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the officer" });
  }
};


// Delete Officer
export const deleteOfficer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Convert ID to integer
    const officerId = parseInt(id);
    if (isNaN(officerId)) {
      return res.status(400).json({ message: "Invalid officer ID" });
    }

    // Find the officer
    const existingOfficer = await prisma.officer.findUnique({
      where: { id: officerId },
    });

    if (!existingOfficer) {
      return res.status(404).json({ message: "Officer not found" });
    }

    // Get the IPRS_PersonId
    const iprsPersonId = existingOfficer.iPRS_PersonId;

    // Delete the officer first
    await prisma.officer.delete({
      where: { id: officerId },
    });

    // Check if any other officers are using the same IPRS_PersonId
    if (iprsPersonId) {
      const otherOfficersUsingIPRS = await prisma.officer.count({
        where: { iPRS_PersonId: iprsPersonId },
      });

      // If no other officers are linked to this IPRS_Person, delete it
      if (otherOfficersUsingIPRS === 0) {
        await prisma.iPRS_Person.delete({
          where: { id: iprsPersonId },
        });
      }
    }

    return res.status(200).json({ message: "Officer deleted successfully" });

  } catch (error) {
    console.error("Error deleting officer:", error);
    return res.status(500).json({ message: "An error occurred while deleting the officer" });
  }
};



//  login user
export const loginOfficer = async (req: Request, res: Response) => {
  console.log(req.body);

  const { service_number, pass } = req.body;
  
  try {
    const officer = await prisma.officer.findUnique({ where: { service_number },

    include: {
      role: true,
      iprs: true,

      Designation: {
        include: {
          role: true,
        },
      },
      station: true,
    }
   });
    if (!officer) return res.status(404).json({ message: "Officer not found" });

    const isPasswordValid = await bcrypt.compare(pass, officer.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    if (officer.is_temporary_password) {
      return res.status(200).json({
        message: "Please reset your password",
        data: { id: officer.id, requiresPasswordReset: true },
      });
    }

    const token = jwt.sign({ id: officer.id, service_number: officer.service_number }, JWTSecret, { expiresIn: "1d" });
    //remove password from response
    const { password, ...rest } = officer;
    return res.status(200).json({ message: "Login successful", data: { token, officer: rest } });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedOfficer = await prisma.officer.update({
      where: { id: parseInt(id) },
      data: {
        password: hashedNewPassword,
        is_temporary_password: false,
      },
    });

    res.json({
      message: "Password reset successfully",
      data: updatedOfficer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while resetting the password" });
  }
};