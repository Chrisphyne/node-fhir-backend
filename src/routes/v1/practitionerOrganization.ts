import express from "express";
import {
  createPractitionerOrganization,
  getAllPractitionerOrganizations,
  getPractitionerOrganizationById,
  updatePractitionerOrganization,
  deletePractitionerOrganization,
} from "../../controllers/practitionerOrganization";
import passport from "../../routes/auth/passport";
const router = express.Router();

router.post("/", passport.authenticate("jwt", { session: false }),  createPractitionerOrganization);
router.get("/", passport.authenticate("jwt", { session: false }), getAllPractitionerOrganizations);
router.get("/:id", passport.authenticate("jwt", { session: false }), getPractitionerOrganizationById);
router.put("/:id", passport.authenticate("jwt", { session: false }), updatePractitionerOrganization);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deletePractitionerOrganization);

export default router;
