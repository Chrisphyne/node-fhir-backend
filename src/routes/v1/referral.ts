import express from "express";
import passport from "../auth/passport";
import {
  createReferral,
  getAllReferrals,
  getReferralById,
  updateReferral,
  deleteReferral,
} from "../../controllers/referral";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createReferral);
router.get("/", getAllReferrals);
router.get("/:id", getReferralById);
router.put("/:id", updateReferral);
router.delete("/:id", deleteReferral);

export default router;
