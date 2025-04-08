import { Router } from "express";
import {
    createOfficer,
    getAllOfficers,
    getAllOfficersCache,
    getOfficerById,
    updateOfficer,
    deleteOfficer,
    loginOfficer,
    resetPassword
} from "../../controllers/officer";
// import passport from "passport";
import { upload } from "../../middleware/multer";

const OfficerRouter = Router();

// Officer Routes
OfficerRouter.post("/",  createOfficer);
OfficerRouter.post("/login", upload.none(), loginOfficer);
OfficerRouter.get("/",  getAllOfficers);
OfficerRouter.get("/cache",  getAllOfficersCache);
OfficerRouter.get("/:id",  getOfficerById);
OfficerRouter.put("/:id",  updateOfficer);
OfficerRouter.delete("/:id",  deleteOfficer);
OfficerRouter.put("/reset-password/:id", resetPassword);


export default OfficerRouter;
