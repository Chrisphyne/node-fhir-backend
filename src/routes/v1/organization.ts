import express from "express";
import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "../../controllers/organization";
import passport from "../../routes/auth/passport";

const router = express.Router();

  

router.post("/", passport.authenticate("jwt", { session: false }), createOrganization);
router.get("/", passport.authenticate("jwt", { session: false }), getAllOrganizations);
router.get("/:id", passport.authenticate("jwt", { session: false }), getOrganizationById);
router.put("/:id", passport.authenticate("jwt", { session: false }), updateOrganization);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteOrganization);

export default router;
