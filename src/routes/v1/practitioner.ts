import express from "express";
import {
  createPractitioner,
  getAllPractitioners,
  getPractitionerById,
  updatePractitioner,
  deletePractitioner,
} from "../../controllers/practitioner";
import passport from "../../routes/auth/passport";

const router = express.Router();

router.post("/", passport.authenticate("jwt", { session: false }), createPractitioner);
router.get("/", passport.authenticate("jwt", { session: false }), getAllPractitioners);
router.get("/:id", passport.authenticate("jwt", { session: false }), getPractitionerById);
router.put("/:id", passport.authenticate("jwt", { session: false }), updatePractitioner);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deletePractitioner);

export default router;
