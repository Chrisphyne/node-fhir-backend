import express from "express";
import passport from "../auth/passport";
import {
  createMaintenanceRecord,
  getAllMaintenanceRecords,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
} from "../../controllers/maintenanceRecord";

const router = express.Router();

// Secure all maintenance routes
router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createMaintenanceRecord);
router.get("/", getAllMaintenanceRecords);
router.get("/:id", getMaintenanceRecordById);
router.put("/:id", updateMaintenanceRecord);
router.delete("/:id", deleteMaintenanceRecord);

export default router;
