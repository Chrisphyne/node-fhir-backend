import { Router } from "express";
import {
    assignRole,
    checkRole,
    createOfficer,
    updateOfficerRole
} from "../../controllers/designation";

const DesignationRouter = Router();

DesignationRouter.post("/", assignRole);
DesignationRouter.get("/", checkRole);
DesignationRouter.get("/:id", createOfficer);
DesignationRouter.put("/:id", updateOfficerRole);

export default DesignationRouter;