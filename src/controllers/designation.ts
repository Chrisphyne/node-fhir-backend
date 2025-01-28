import { Request, Response } from "express";
import { prisma } from "../app";
import bcrypt from "bcrypt";
import { searchIPRSPerson } from "../service/search_iprs";

declare global {
    namespace Express {
        interface User {
            designation?: any;  // Or use proper Designation type from your Prisma schema
        }
    }
}

// Assign role to a user
export const assignRole = async (req: Request, res: Response) => {
    const { userId, role, countiesId } = req.body;

    try {
        const newDesignation = await prisma.designation.create({
            data: {
                userId,
                role,
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
        const userId = req.user.id; // Assuming user ID is stored in req.user

        try {
            const designation = await prisma.designation.findFirst({
                where: { userId: parseInt(userId) },
            });

            if (!designation || !roles.includes(designation.role)) {
                return res.status(403).json({
                    message: "Access denied. Insufficient permissions.",
                });
            }

            req.user.designation = designation; // Attach designation to request
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred while checking permissions." });
        }
    };
};

// Fetch reports based on user role
// export const fetchReports = async (req: Request, res: Response) => {
//     const { designation } = req.user; // Assuming designation is attached to req.user

//     try {
//         let reports;

//         if (designation.role === "Admin") {
//             reports = await prisma.report.findMany();
//         } else if (designation.role === "Manager" || designation.role === "User") {
//             reports = await prisma.report.findMany({
//                 where: { countiesId: designation.countiesId },
//             });
//         } else {
//             return res.status(403).json({
//                 message: "Access denied. Invalid role.",
//             });
//         }

//         res.json({
//             message: "Reports fetched successfully",
//             data: reports,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "An error occurred while fetching reports",
//         });
//     }
// };


// Create users (Manager and Admin only)
export const createUser = async (req: Request, res: Response) => {
    const { designation } = req.user; // Assuming designation is attached to req.user

    if (designation.role !== "Admin" && designation.role !== "Manager") {
        return res.status(403).json({
            message: "Access denied. Insufficient permissions.",
        });
    }

    const { email, telephone, password, id_no, role: userRole, countiesId } = req.body;

    try {
        // Validate input
        if (!email || !telephone || !password || !id_no) {
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
        const newUser = await prisma.user.create({
            data: {
                name: fullName,
                email,
                telephone,
                password: hashedPassword,
                iPRS_PersonId: iprsPerson.id,
                created_at: new Date(),
            },
        });

        await prisma.designation.create({
            data: {
                userId: newUser.id,
                role: userRole,
                countiesId,
            },
        });

        res.status(201).json({
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        console.error("Error creating user:", error);

        if (error.code === "P2002") {
            // Prisma unique constraint violation
            return res.status(409).json({ message: "Email or telephone already exists" });
        }

        res.status(500).json({
            message: "An error occurred while creating the user",
        });
    }
};

// Update user role (Admin only)
export const updateUserRole = async (req: Request, res: Response) => {
    const { designation } = req.user;

    if (designation.role !== "Admin") {
        return res.status(403).json({
            message: "Access denied. Only Admins can update roles.",
        });
    }

    const { userId, newRole, countiesId } = req.body;

    try {
        const designation = await prisma.designation.findFirst({
            where: { userId: parseInt(userId) }
        });

        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }

        const updatedDesignation = await prisma.designation.update({
            where: { id: designation.id },
            data: {
                role: newRole,
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
