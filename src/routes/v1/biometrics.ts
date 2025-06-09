import { Router } from "express";
import {
    createBiometrics,
    getAllBiometrics,
    getBiometricsById,
    getBiometricsByOfficerId,
    updateBiometrics,
    deleteBiometrics
} from "../../controllers/biometrics";
import { biometricsUpload } from '../../middleware/biometricsUpload';
// import passport from "passport";

const BiometricsRouter = Router();

// Create biometrics record with file uploads
BiometricsRouter.post("/", biometricsUpload.any(), createBiometrics);

// Get all biometrics records
BiometricsRouter.get("/", getAllBiometrics);

// Get biometrics by ID
BiometricsRouter.get("/:id", getBiometricsById);

// Get biometrics by officer ID
BiometricsRouter.get("/officer/:officerId", getBiometricsByOfficerId);

// Update biometrics record with file uploads
BiometricsRouter.put("/:id", biometricsUpload.any(), updateBiometrics);

// Delete biometrics record
BiometricsRouter.delete("/:id", deleteBiometrics);

export { BiometricsRouter };