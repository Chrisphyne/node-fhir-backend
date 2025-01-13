import { Request, Response } from "express";
import { prisma } from "../app";
import axios from "axios";

declare global {
  namespace Express {
    interface User {
      id: string
    }
  }
}

// Create new SubModuleData
export const createSubModuleData = async (req: Request, res: Response) => {
  const { subModuleId } = req.body;
  // console.log(req.body);
  const files = req.files as Express.Multer.File[]; // Access uploaded files

  try {
    const formData = JSON.parse(req.body.formData); // Parse formData as JSON
    if (!req.body.formData || typeof req.body.formData !== 'string') {
      return res.status(400).send({ error: 'formData is missing or not a valid string' });
    }
  
    const filePaths = files.map((file) => `uploads/${file.filename}`); // Get file paths

    // Save to database
    const newSubModuleData = await prisma.sub_module_data.create({
      data: {
        sub_moduleId: parseInt(subModuleId, 10),
        userId: parseInt(req.user?.id, 10),
        formData, // Store the parsed JSON object
        attachments: filePaths, // Store file paths
      },
    });
    res.status(201).json({
      message: "SubModuleData created and sent for approval successfully",
      data: newSubModuleData,
    });

    const jwtToken = (req.user as any).token;

    // Prepare data for external API
    const externalPayload = {
      subModuleDataId: newSubModuleData.id,
      subModuleId: newSubModuleData.sub_moduleId,
      userId: newSubModuleData.userId,
      formData: newSubModuleData.formData,
      attachments: newSubModuleData.attachments,
    };

    // Send data to external application for approval
    const externalAppUrl = "https://inc-backend.cabinex.co.ke/api/v1/approval"; 
    
    const externalResponse = await axios.post(externalAppUrl, externalPayload, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${jwtToken}`, // Include the JWT token
      },
    });

    if (externalResponse.status === 200) {
      console.log("Data sent to external application successfully");
    } else {
      console.error("External application returned an error:", externalResponse.statusText);
    }

  } catch (error) {
    console.error("Error creating SubModuleData:", error);
    res.status(500).json({ message: "An error occurred while creating the SubModuleData" });
  }
};


export const getUserApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    const userApplications = await prisma.sub_module_data.findMany({
      where: {
        userId: parseInt(userId), // Fetch only the logged-in user's applications
      },
      select: {
        id: true,
        sub_moduleId: true,
        formData: true,
        attachments: true,
        submissionDate: true,
      },
    });

    res.status(200).json({
      message: "User applications fetched successfully.",
      data: userApplications,
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "An error occurred while fetching applications." });
  }
};



// Get all SubModuleData
export const getAllSubModuleData = async (req: Request, res: Response) => {
  try {
    const subModuleData = await prisma.sub_module_data.findMany({
      orderBy: { submissionDate: "desc" },
      include: {
        user: true,
        sub_module: true,
      },
    });

    res.status(200).json({
      message: "SubModuleData fetched successfully",
      data: subModuleData,
    });
  } catch (error) {
    console.error("Error fetching SubModuleData:", error);
    res.status(500).json({ message: "An error occurred while fetching the SubModuleData" });
  }
};

// Get SubModuleData by ID
export const getSubModuleDataById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const subModuleData = await prisma.sub_module_data.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        sub_module: true,
      },
    });

    if (!subModuleData) {
      return res.status(404).json({ message: "SubModuleData not found" });
    }

    res.status(200).json({
      message: "SubModuleData fetched successfully",
      data: subModuleData,
    });
  } catch (error) {
    console.error("Error fetching SubModuleData:", error);
    res.status(500).json({ message: "An error occurred while fetching the SubModuleData" });
  }
};

// Update SubModuleData
export const updateSubModuleData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { sub_moduleId, userId } = req.body;
  const files = req.files as Express.Multer.File[]; // Access uploaded files

  try {
    const formData = JSON.parse(req.body.formData); // Parse formData as JSON
    const filePaths = files.map((file) => `uploads/${file.filename}`); // Get file paths

    const updatedSubModuleData = await prisma.sub_module_data.update({
      where: { id: parseInt(id) },
      data: {
        sub_moduleId: parseInt(sub_moduleId, 10),
        userId: parseInt(userId, 10),
        formData, // Store the parsed JSON object
        attachments: filePaths, // Update file paths
      },
    });

    res.status(200).json({
      message: "SubModuleData updated successfully",
      data: updatedSubModuleData,
    });
  } catch (error) {
    console.error("Error updating SubModuleData:", error);
    res.status(500).json({ message: "An error occurred while updating the SubModuleData" });
  }
};

// Delete SubModuleData
export const deleteSubModuleData = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.sub_module_data.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting SubModuleData:", error);
    res.status(500).json({ message: "An error occurred while deleting the SubModuleData" });
  }
};
