import { Request, Response } from "express";
import { prisma } from "../app";
import bcrypt from "bcrypt";
import { searchIPRSPerson } from "../service/search_iprs";

declare global {
    namespace Express {
        interface Officer {
            designation?: any;  // Or use proper Designation type from your Prisma schema
        }
    }
}

// Assign role to a officer
export const assignRole = async (req: Request, res: Response) => {
    const { officerId, roleId, countiesId } = req.body;

    try {
        const newDesignation = await prisma.designation.create({
            data: {
                officerId,
                roleId,
                countiesId,
            },
        });

        res.status(201).json({
            message: "Role assigned successfully",
            data: newDesignation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while assigning the role",
        });
    }
};

// Middleware to check user permissions
export const checkRole = (roles: string[]) => {
    return async (req: Request, res: Response, next: Function) => {
        const officerId = (req as any).officer?.id; // Safely access officer ID with type assertion

        try {
            const designation = await prisma.designation.findFirst({
                where: { officerId },
            });

            if (!designation || !roles.includes(designation.roleId.toString())) {
                return res.status(403).json({
                    message: "Access denied. Insufficient permissions.",
                });
            }

            (req as any).officer = { designation }; // Attach designation to request object
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while checking permissions." });
        }
    };
};




// Create users (Manager and Admin only)
export const createOfficer = async (req: Request, res: Response) => {
    const { designation } = (req as any).officer; // Type assertion to access officer property

    if (designation.role !== "Admin" && designation.role !== "Manager") {
        return res.status(403).json({
            message: "Access denied. Insufficient permissions.",
        });
    }

    const { email, service_number, password, id_no, rank, badge_no, date_of_birth, gender, contact_info, emergency_contact_info, role: userRole, countiesId } = req.body;

    try {
        // Validate input
        if (!email || !service_number || !password || !id_no) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Fetch or create IPRS_Person using the provided ID number
        const iprsPerson = await searchIPRSPerson(id_no);

        if (!iprsPerson) {
            return res.status(404).json({ message: "IPRS person not found" });
        }

        const fullName = `${iprsPerson.first_name} ${iprsPerson.middle_name || ""} ${iprsPerson.last_name}`.trim();

        // Create user without locationId
        const newOfficer = await prisma.officer.create({
            data: {
                name: fullName,
                email,
                service_number,
                rank,
                badge_no,
                date_of_birth,
                gender,
                contact_info,
                emergency_contact_info,
                password: hashedPassword,
                iPRS_PersonId: iprsPerson.id,
                created_at: new Date(),
            },
        });

        await prisma.designation.create({
            data: {
                officerId: newOfficer.id,
                roleId: userRole,
                countiesId,
            },
        });

        res.status(201).json({
            message: "Officer created successfully",
            data: newOfficer,
        });
    } catch (error) {
        console.error("Error creating officer:", error);

        if (error.code === "P2002") {
            // Prisma unique constraint violation
            return res.status(409).json({ message: "Email or telephone already exists" });
        }

        res.status(500).json({
            message: "An error occurred while creating the officer",
        });
    }
};

// Update user role (Admin only)
export const updateOfficerRole = async (req: Request, res: Response) => {
    const { designation } = (req as any).officer;

    if (designation.role !== "Admin") {
        return res.status(403).json({
            message: "Access denied. Only Admins can update roles.",
        });
    }

    const { officerId, newRole, countiesId } = req.body;

    try {
        const designation = await prisma.designation.findFirst({
            where: { officerId: parseInt(officerId.toString()) },
        });

        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }

        const updatedDesignation = await prisma.designation.update({
            where: { id: designation.id },
            data: {
                roleId: newRole,
                countiesId,
            },
        });

        res.json({
            message: "User role updated successfully",
            data: updatedDesignation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while updating the user role",
        });
    }
};
