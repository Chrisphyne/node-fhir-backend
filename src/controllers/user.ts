import { Request, Response } from "express";
import { JWTSecret, prisma } from "../app";
import { searchIPRSPerson } from "../service/search_iprs";
// import bcrypt from "bcrypt";
const jwt = require('jsonwebtoken')
// import crypto from "crypto";
import bcrypt from "bcrypt";


export const createUser = async (req: Request, res: Response) => {
  const { name, id_no, service_number, password, rank, badge_no, date_of_birth, gender, contact_info, emergency_contact_info } = req.body;

  try {
    // Validate input
    if (!name || !id_no || !service_number || !password || !rank || !badge_no || !date_of_birth || !gender || !contact_info || !emergency_contact_info) {
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
    const newUser = await prisma.officer.create({
      data: {
        name: fullName,
        rank,
        badge_no,
        date_of_birth,
        gender,
        contact_info,
        emergency_contact_info,
        service_number,
        password: hashedPassword,
        iPRS_PersonId: iprsPerson.id,
        created_at: new Date(),
      },
    });

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === "P2002") {
      // Prisma unique constraint violation
      return res.status(409).json({ message: "Email or telephone already exists" });
    }

    return res.status(500).json({ message: "An error occurred while creating the user" });
  }
};




// Read All Users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.officer.findMany({
            include: { iprs: true }, // Include IPRS_Person relationship
            orderBy: { id: 'desc' },
        });

        res.json({
            message: "All users fetched successfully",
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching users" });
    }
};

// Read User by ID
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.officer.findUnique({
            where: { id: parseInt(id) },
            include: { iprs: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User fetched successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the user" });
    }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, rank, badge_no, date_of_birth, gender, contact_info, emergency_contact_info } = req.body;

  try {
    // Check if the user exists
    const existingUser = await prisma.officer.findUnique({ where: { id: parseInt(id) } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
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

    // Update User
    const updatedUser = await prisma.officer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        rank,
        badge_no,
        date_of_birth,
        gender,
        contact_info,
        emergency_contact_info,
      },
    });

    res.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the user" });
  }
};


// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if the user exists
    const existingUser = await prisma.officer.findUnique({ where: { id: parseInt(id) } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated IPRS_Person if it exists
    if (existingUser.iPRS_PersonId) {
      await prisma.iPRS_Person.delete({
        where: { id: existingUser.iPRS_PersonId },
      });
    }

    // Delete User
    await prisma.officer.delete({ where: { id: parseInt(id) } });

    res.status(204).send(); // No content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting the user" });
  }
};


//  login user
export const loginUser = async (req: Request, res: Response) => {
  const { service_number, password } = req.body;

  console.log("====================================");
  console.log("Login Attempt:", { service_number });
  console.log("====================================");

  try {
    // Validate input
    if (!service_number || !password) {
      return res.status(400).json({ message: "service_number  and password are required" });
    }

    // Check if user exists
    const user = await prisma.officer.findUnique({
      where: { service_number },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   

    // Generate JWT token
    const validJwt = jwt.sign(
      { id: user.id, service_number: user.service_number },
      JWTSecret,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Send success response with the user data, token, and profileIncomplete flag
    return res.status(200).json({
      message: "Login successful",
      data: {
        token: validJwt,
        user, // Indicates if the user needs to complete their profile
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};


