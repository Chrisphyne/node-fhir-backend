import { Router } from 'express';
import {
    createRegion,
    getAllRegions,
    getRegionById,
    updateRegion,
    deleteRegion,
    searchRegionByName
} from '../../controllers/region';

let passport = require('passport');

export const RegionRouter = Router();

RegionRouter.post("/", passport.authenticate('jwt', { session: false }), createRegion);
RegionRouter.get("/", passport.authenticate('jwt', { session: false }), getAllRegions);
RegionRouter.get("/:id", passport.authenticate('jwt', { session: false }), getRegionById);
RegionRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateRegion);
RegionRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteRegion);
RegionRouter.get("/search/:name", passport.authenticate('jwt', { session: false }), searchRegionByName);
