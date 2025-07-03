import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../../controllers/patient";
import passport from "../../routes/auth/passport";

const router = express.Router();

router.post("/", passport.authenticate("jwt", { session: false }), createPatient);
router.get("/", passport.authenticate("jwt", { session: false }), getAllPatients);
router.get("/:id", passport.authenticate("jwt", { session: false }), getPatientById);
router.put("/:id", passport.authenticate("jwt", { session: false }), updatePatient);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deletePatient);

export default router;
