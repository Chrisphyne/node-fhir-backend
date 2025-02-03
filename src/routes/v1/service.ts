import { Router } from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
} from '../../controllers/service';

let passport = require('passport');


export const ServiceRouter = Router();

ServiceRouter.post("/", passport.authenticate('jwt', { session: false }), createService);
ServiceRouter.get("/", passport.authenticate('jwt', { session: false }), getAllServices);
ServiceRouter.get("/:id", passport.authenticate('jwt', { session: false }), getServiceById);
ServiceRouter.put("/:id", passport.authenticate('jwt', { session: false }), updateService);
ServiceRouter.delete("/:id", passport.authenticate('jwt', { session: false }), deleteService);
    