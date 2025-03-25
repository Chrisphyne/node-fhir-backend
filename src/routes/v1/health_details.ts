import { Router } from "express";
import {
    createHealthDetail,
    getAllHealthDetails,
    getHealthDetailById,
    updateHealthDetail,
    deleteHealthDetail
} from "../../controllers/health_details";
import passport from "passport";

const HealthDetailsRouter = Router();

HealthDetailsRouter.post("/", passport.authenticate('jwt', { session: false }), createHealthDetail);
HealthDetailsRouter.get("/", passport.authenticate('jwt', { session: false }), getAllHealthDetails);
HealthDetailsRouter.get("/:id", passport.authenticate('jwt', { session: false }), getHealthDetailById);
HealthDetailsRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateHealthDetail);
HealthDetailsRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteHealthDetail);

export default HealthDetailsRouter;
