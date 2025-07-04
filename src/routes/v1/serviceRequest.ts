import express from "express";
import passport from "../auth/passport";
import {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  deleteServiceRequest,
} from "../../controllers/serviceRequest";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createServiceRequest);
router.get("/", getAllServiceRequests);
router.get("/:id", getServiceRequestById);
router.put("/:id", updateServiceRequest);
router.delete("/:id", deleteServiceRequest);

export default router;
