
import { prisma } from "../app";
import { Multer } from "multer";

import { Request, Response } from "express";
import {
    createBiometricsRecord,
    updateBiometricsRecord,
    findBiometricsById,
    findAllBiometrics,
    findBiometricsByOfficerId,
    deleteBiometricsById
} from "../service/biometricsService";
import { processFingerprintFiles, validateBiometricsInput } from "../utils/fingerprintUtils";

export const createBiometrics = async (req: Request, res: Response) => {
    try {
        const officerId = validateBiometricsInput(req.body.officerId);
        const fingerprintData = processFingerprintFiles(req.files as Express.Multer.File[]);
        const newRecord = await createBiometricsRecord(officerId, fingerprintData);
        res.status(201).json({ success: true, data: newRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to create biometrics record" });
    }
};

export const updateBiometrics = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const fingerprintData = processFingerprintFiles(req.files as Express.Multer.File[]);
        const updatedRecord = await updateBiometricsRecord(parseInt(id), fingerprintData);
        res.json({ success: true, data: updatedRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to update biometrics record" });
    }
};

export const getBiometricsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const record = await findBiometricsById(parseInt(id));
        if (!record) {
            return res.status(404).json({ success: false, message: "Record not found" });
        }
        res.json({ success: true, data: record });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch biometrics record" });
    }
};

export const getAllBiometrics = async (req: Request, res: Response) => {
    try {
        const records = await findAllBiometrics();
        res.json({ success: true, data: records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch biometrics records" });
    }
};

export const getBiometricsByOfficerId = async (req: Request, res: Response) => {
    try {
        const { officerId } = req.params;
        const records = await findBiometricsByOfficerId(parseInt(officerId));
        res.json({ success: true, data: records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to fetch biometrics records for officer" });
    }
};

export const deleteBiometrics = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteBiometricsById(parseInt(id));
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to delete biometrics record" });
    }
};




























































// import { Request, Response } from "express";
// import { prisma } from "../app";

// // Helper function to process uploaded files
// const processFingerprintFiles = (req: Request) => {
//     const files = req.files as Express.Multer.File[];
    
//     return {
//         left_index: files.find((file) => file.fieldname === 'left_index')?.path || null,
//         left_middle: files.find((file) => file.fieldname === 'left_middle')?.path || null,
//         left_ring: files.find((file) => file.fieldname === 'left_ring')?.path || null,
//         left_pinky: files.find((file) => file.fieldname === 'left_pinky')?.path || null,
//         left_thumb: files.find((file) => file.fieldname === 'left_thumb')?.path || null,
//         right_index: files.find((file) => file.fieldname === 'right_index')?.path || null,
//         right_middle: files.find((file) => file.fieldname === 'right_middle')?.path || null,
//         right_ring: files.find((file) => file.fieldname === 'right_ring')?.path || null,
//         right_pinky: files.find((file) => file.fieldname === 'right_pinky')?.path || null,
//         right_thumb: files.find((file) => file.fieldname === 'right_thumb')?.path || null,
//         // Process other attachments if needed
//         attachments: files
//             .filter(file => file.fieldname === 'attachments')
//             .map(file => file.path)
//     };
// };

// // Create new biometrics with file uploads
// export const createBiometrics = async (req: Request, res: Response) => {
//     const { officerId } = req.body;

//     try {
//         const fingerprintData = processFingerprintFiles(req);

//         const newBiometrics = await prisma.biometrics.create({
//             data: {
//                 officerId: parseInt(officerId),
//                 ...fingerprintData
//             }
//         });

//         res.status(201).json({
//             message: "Biometrics created successfully",
//             data: newBiometrics
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while creating biometrics' });
//     }
// };

// // Get all biometrics records
// export const getAllBiometrics = async (req: Request, res: Response) => {
//     try {
//         const biometrics = await prisma.biometrics.findMany({
//             orderBy: {
//                 submissionDate: 'desc',
//             },
//             include: {
//                 officer: true
//             }
//         });

//         res.json({
//             message: "All biometrics records fetched successfully",
//             data: biometrics
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while fetching biometrics records' });
//     }
// };

// // Update biometrics with file uploads
// export const updateBiometrics = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { officerId } = req.body;

//     try {
//         const fingerprintData = processFingerprintFiles(req);

//         // First get current record to merge with existing data
//         const currentRecord = await prisma.biometrics.findUnique({
//             where: { id: parseInt(id) }
//         });

//         if (!currentRecord) {
//             return res.status(404).json({ message: 'Biometrics record not found' });
//         }

//         // Merge existing data with new uploads (only update fields that have new files)
//         const updatedData = {
//             left_index: fingerprintData.left_index || currentRecord.left_index,
//             left_middle: fingerprintData.left_middle || currentRecord.left_middle,
//             left_ring: fingerprintData.left_ring || currentRecord.left_ring,
//             left_pinky: fingerprintData.left_pinky || currentRecord.left_pinky,
//             left_thumb: fingerprintData.left_thumb || currentRecord.left_thumb,
//             right_index: fingerprintData.right_index || currentRecord.right_index,
//             right_middle: fingerprintData.right_middle || currentRecord.right_middle,
//             right_ring: fingerprintData.right_ring || currentRecord.right_ring,
//             right_pinky: fingerprintData.right_pinky || currentRecord.right_pinky,
//             right_thumb: fingerprintData.right_thumb || currentRecord.right_thumb,
//             // For attachments, we might want to append or replace - here we're replacing
//             attachments: fingerprintData.attachments.length > 0 
//                 ? fingerprintData.attachments 
//                 : currentRecord.attachments
//         };

//         const updatedBiometrics = await prisma.biometrics.update({
//             where: { id: parseInt(id) },
//             data: updatedData
//         });

//         res.json({
//             message: "Biometrics updated successfully",
//             data: updatedBiometrics
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while updating the biometrics record' });
//     }
// };

// // Get biometrics by ID
// export const getBiometricsById = async (req: Request, res: Response) => {
//     const { id } = req.params;

//     try {
//         const biometrics = await prisma.biometrics.findUnique({
//             where: { id: parseInt(id) },
//             include: {
//                 officer: true
//             }
//         });

//         if (!biometrics) {
//             return res.status(404).json({ message: 'Biometrics record not found' });
//         }

//         res.json({
//             message: "Biometrics record fetched successfully",
//             data: biometrics
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while fetching the biometrics record' });
//     }
// };

// // Get biometrics by officer ID
// export const getBiometricsByOfficerId = async (req: Request, res: Response) => {
//     const { officerId } = req.params;

//     try {
//         const biometrics = await prisma.biometrics.findMany({
//             where: { officerId: parseInt(officerId) },
//             orderBy: {
//                 submissionDate: 'desc',
//             },
//             include: {
//                 officer: true
//             }
//         });

//         if (!biometrics || biometrics.length === 0) {
//             return res.status(404).json({ message: 'No biometrics records found for this officer' });
//         }

//         res.json({
//             message: "Biometrics records fetched successfully",
//             data: biometrics
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while fetching biometrics records' });
//     }
// };

// // Delete biometrics by ID
// export const deleteBiometrics = async (req: Request, res: Response) => {
//     const { id } = req.params;

//     try {
//         await prisma.biometrics.delete({
//             where: { id: parseInt(id) }
//         });

//         res.status(204).send();
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while deleting the biometrics record' });
//     }
// };
