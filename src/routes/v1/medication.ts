import express from "express";
import passport from "../auth/passport";
import {
  createMedication,
  getAllMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
} from "../../controllers/medication";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createMedication);
router.get("/", getAllMedications);
router.get("/:id", getMedicationById);
router.put("/:id", updateMedication);
router.delete("/:id", deleteMedication);

export default router;
