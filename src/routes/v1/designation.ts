import { Router } from "express";
import {
    createDesignation,
    getAllDesignations,
    getDesignationById,
    updateDesignation,
    deleteDesignation
} from "../../controllers/designation";

const DesignationRouter = Router();

DesignationRouter.post("/", createDesignation);
DesignationRouter.get("/", getAllDesignations);
DesignationRouter.get("/:id", getDesignationById);
DesignationRouter.put("/:id", updateDesignation);
DesignationRouter.delete("/:id", deleteDesignation);

export default DesignationRouter;