import express from "express";
import {
  createUserOrganizationAccess,
  getAllUserOrganizationAccess,
  getUserOrganizationAccessById,
  updateUserOrganizationAccess,
  deleteUserOrganizationAccess,
} from "../../controllers/userOrganizationAccess";

const router = express.Router();

router.post("/", createUserOrganizationAccess);
router.get("/", getAllUserOrganizationAccess);
router.get("/:id", getUserOrganizationAccessById);
router.put("/:id", updateUserOrganizationAccess);
router.delete("/:id", deleteUserOrganizationAccess);

export default router;
