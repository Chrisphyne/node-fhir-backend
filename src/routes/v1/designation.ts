import { Router } from "express";
import {
    assignRole,
    checkRole,
    createUser,
    updateUserRole
} from "../../controllers/designation";

const DesignationRouter = Router();

DesignationRouter.post("/", assignRole);
DesignationRouter.get("/", checkRole);
DesignationRouter.get("/:id", createUser);
DesignationRouter.put("/:id", updateUserRole);

export default DesignationRouter;