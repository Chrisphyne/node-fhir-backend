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

// router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createOrganization);
router.get("/",  getAllOrganizations);
router.get("/:id",  getOrganizationById);
router.put("/:id", updateOrganization);
router.delete("/:id",  deleteOrganization);

export default router;
