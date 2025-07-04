import express from "express";
import passport from "../auth/passport";
import {
  createDiagnosticReport,
  getAllDiagnosticReports,
  getDiagnosticReportById,
  updateDiagnosticReport,
  deleteDiagnosticReport,
} from "../../controllers/diagnosticReport";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createDiagnosticReport);
router.get("/", getAllDiagnosticReports);
router.get("/:id", getDiagnosticReportById);
router.put("/:id", updateDiagnosticReport);
router.delete("/:id", deleteDiagnosticReport);

export default router;
