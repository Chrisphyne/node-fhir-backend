import express from "express";
import passport from "../auth/passport";
import {
  createAuditLog,
  getAllAuditLogs,
  getAuditLogById,
  deleteAuditLog,
} from "../../controllers/auditLog";

const router = express.Router();

// Protect routes
router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createAuditLog); // Only allow internally or admin
router.get("/", getAllAuditLogs);
router.get("/:id", getAuditLogById);
router.delete("/:id", deleteAuditLog); // Optional admin only

export default router;
