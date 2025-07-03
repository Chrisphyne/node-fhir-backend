import express from "express";
import {
  createPatientOrganization,
  getAllPatientOrganizations,
  getPatientOrganizationById,
  updatePatientOrganization,
  deletePatientOrganization,
} from "../../controllers/patientOrganization";
import passport from "../../routes/auth/passport";

const router = express.Router();

router.post("/", passport.authenticate("jwt", { session: false }), createPatientOrganization);
router.get("/", passport.authenticate("jwt", { session: false }), getAllPatientOrganizations);
router.get("/:id", passport.authenticate("jwt", { session: false }), getPatientOrganizationById);
router.put("/:id", passport.authenticate("jwt", { session: false }), updatePatientOrganization);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deletePatientOrganization);

export default router;
