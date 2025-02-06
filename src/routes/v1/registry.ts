import { Router } from "express";
import {
    createRegistry,
    getAllRegistries,
    getRegistryById,
    updateRegistry,
    deleteRegistry,
} from "../../controllers/registry";
import { upload } from "../../middleware/multer";

const RegistryRouter = Router();

RegistryRouter.post("/", upload.array("icon", 5), createRegistry); // Allow multiple image uploads
RegistryRouter.get("/", getAllRegistries);
RegistryRouter.get("/:id", getRegistryById);
RegistryRouter.put("/:id", upload.array("icon", 5), updateRegistry);
RegistryRouter.delete("/:id", deleteRegistry);  

export default RegistryRouter;
