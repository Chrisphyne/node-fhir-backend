import { Router } from "express";
import {
    createModule,
    getAllModules,
    getModuleById,
    updateModule,
    deleteModule
} from "../../controllers/module";
import passport from "passport";

const ModuleRouter = Router();
// Module Routes
ModuleRouter.post("/", passport.authenticate('jwt', { session: false }), createModule);
ModuleRouter.get("/", passport.authenticate('jwt', { session: false }), getAllModules);
ModuleRouter.get("/:id", passport.authenticate('jwt', { session: false }), getModuleById);
ModuleRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateModule);
ModuleRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteModule);

export { ModuleRouter };