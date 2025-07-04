import express from "express";
import passport from "../auth/passport";
import {
  createObservation,
  getAllObservations,
  getObservationById,
  updateObservation,
  deleteObservation,
} from "../../controllers/observation";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createObservation);
router.get("/", getAllObservations);
router.get("/:id", getObservationById);
router.put("/:id", updateObservation);
router.delete("/:id", deleteObservation);

export default router;
