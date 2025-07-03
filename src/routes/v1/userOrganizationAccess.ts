import express from "express";
import {
  createUserOrganizationAccess,
  getAllUserOrganizationAccess,
  getUserOrganizationAccessById,
  updateUserOrganizationAccess,
  deleteUserOrganizationAccess,
} from "../../controllers/userOrganizationAccess";
import passport from "../../routes/auth/passport";

const router = express.Router();

router.post("/", passport.authenticate("jwt", { session: false }),   createUserOrganizationAccess);
router.get("/", passport.authenticate("jwt", { session: false }), getAllUserOrganizationAccess);
router.get("/:id", passport.authenticate("jwt", { session: false }), getUserOrganizationAccessById);
router.put("/:id", passport.authenticate("jwt", { session: false }), updateUserOrganizationAccess);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteUserOrganizationAccess);

export default router;
