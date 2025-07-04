import express from "express";
import passport from "../auth/passport";
import {
  createEncounter,
  getAllEncounters,
  getEncounterById,
  updateEncounter,
  deleteEncounter,
} from "../../controllers/encounter";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createEncounter);
router.get("/", getAllEncounters);
router.get("/:id", getEncounterById);
router.put("/:id", updateEncounter);
router.delete("/:id", deleteEncounter);

export default router;
