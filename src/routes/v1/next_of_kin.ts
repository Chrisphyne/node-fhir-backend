import { Router } from "express";
import {
    createNextOfKin,
    getAllNextOfKin,
    getNextOfKinById,
    updateNextOfKin,
    deleteNextOfKin 
} from "../../controllers/next_of_kin";
import passport from "passport";

const NextOfKinRouter = Router();

NextOfKinRouter.post("/", passport.authenticate('jwt', { session: false }), createNextOfKin);
NextOfKinRouter.get("/", passport.authenticate('jwt', { session: false }), getAllNextOfKin);
NextOfKinRouter.get("/:id", passport.authenticate('jwt', { session: false }), getNextOfKinById);
NextOfKinRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateNextOfKin);
NextOfKinRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteNextOfKin);

export default NextOfKinRouter;
