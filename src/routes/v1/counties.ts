import { Router } from 'express';
import { createCounties, getAllCounties, getCountiesById, updateCounties, searchCountiesByName, deleteCounties } from '../../controllers/counties';

let passport = require('passport')

export const CountiesRouter = Router();

CountiesRouter.post("/", passport.authenticate('jwt', { session: false }), createCounties);
CountiesRouter.get("/", passport.authenticate('jwt', { session: false }), getAllCounties);
CountiesRouter.get("/:id", passport.authenticate('jwt', { session: false }), getCountiesById);
CountiesRouter.put("/:id",  passport.authenticate('jwt', { session: false }), updateCounties);
CountiesRouter.delete("/:id",  passport.authenticate('jwt', { session: false }), deleteCounties);
CountiesRouter.get('/counties/search/', passport.authenticate('jwt', { session: false }), searchCountiesByName);


