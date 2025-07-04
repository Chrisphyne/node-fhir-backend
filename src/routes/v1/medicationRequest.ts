import express from "express";
import passport from "../auth/passport";
import {
  createMedicationRequest,
  getAllMedicationRequests,
  getMedicationRequestById,
  updateMedicationRequest,
  deleteMedicationRequest,
} from "../../controllers/medicationRequest";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createMedicationRequest);
router.get("/", getAllMedicationRequests);
router.get("/:id", getMedicationRequestById);
router.put("/:id", updateMedicationRequest);
router.delete("/:id", deleteMedicationRequest);

export default router;
