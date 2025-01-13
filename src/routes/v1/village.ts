import { Router } from "express";
import {
    createVillage,
    getAllVillages,
    getVillageById,
    updateVillage,
    deleteVillage
} from "../../controllers/village";
import passport from "passport";

const VillageRouter = Router();

VillageRouter.post("/", passport.authenticate('jwt', { session: false }),   createVillage);
VillageRouter.get("/", passport.authenticate('jwt', { session: false }), getAllVillages);
VillageRouter.get("/:id", passport.authenticate('jwt', { session: false }), getVillageById);
VillageRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateVillage);
VillageRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteVillage);

export default VillageRouter;
