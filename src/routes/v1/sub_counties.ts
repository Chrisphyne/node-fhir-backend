import { Router } from "express";
import {
    createSubCounty,
    getAllSubCounties,
    getSubCountyById,
    updateSubCounty,
    deleteSubCounty
} from "../../controllers/sub_counties";
import passport from "passport";

const SubCountiesRouter = Router();

SubCountiesRouter.post("/", passport.authenticate('jwt', { session: false }), createSubCounty);
SubCountiesRouter.get("/", passport.authenticate('jwt', { session: false }), getAllSubCounties);
SubCountiesRouter.get("/:id", passport.authenticate('jwt', { session: false }), getSubCountyById);
SubCountiesRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateSubCounty);
SubCountiesRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteSubCounty);

export default SubCountiesRouter;
