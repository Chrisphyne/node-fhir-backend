import { Router } from "express";
import {
    createSubModule,
    getAllSubModules,
    getSubModuleById,
    updateSubModule,
    deleteSubModule
} from "../../controllers/sub_module";
import passport from "passport";
const SubModulesRouter = Router();

SubModulesRouter.post("/", passport.authenticate('jwt', { session: false }), createSubModule);
SubModulesRouter.get("/", passport.authenticate('jwt', { session: false }), getAllSubModules);    
SubModulesRouter.get("/:id", passport.authenticate('jwt', { session: false }),  getSubModuleById);
SubModulesRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateSubModule);
SubModulesRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteSubModule);

export { SubModulesRouter };
