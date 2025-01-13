import { Router } from "express";
import {
    createlocation,
    getAllLocation,
    getlocationById,
    updatelocation,
    deletelocation
} from "../../controllers/location";
import passport from "passport";

const locationRouter = Router();

locationRouter.post("/", passport.authenticate('jwt', { session: false }), createlocation);
locationRouter.get("/", passport.authenticate('jwt', { session: false }), getAllLocation);
locationRouter.get("/:id", passport.authenticate('jwt', { session: false }), getlocationById);
locationRouter.put("/:id", passport.authenticate('jwt', { session: false }), updatelocation);
locationRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deletelocation);

export default locationRouter;
