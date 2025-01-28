import { Router } from 'express';
import {
    createDivision,
    getAllDivisions,
    getDivisionById,
    updateDivision,
    deleteDivision,
    searchDivisionsByName,
} from '../../controllers/division';

let passport = require('passport');

export const DivisionRouter = Router();

DivisionRouter.post("/", passport.authenticate('jwt', { session: false }), createDivision);
DivisionRouter.get("/", passport.authenticate('jwt', { session: false }), getAllDivisions);
DivisionRouter.get("/:id", passport.authenticate('jwt', { session: false }), getDivisionById);
DivisionRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateDivision);
DivisionRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteDivision);
DivisionRouter.get("/search/:name", passport.authenticate('jwt', { session: false }), searchDivisionsByName);
