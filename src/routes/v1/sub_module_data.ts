import { Router } from "express";
import {
    createSubModuleData,
    getAllSubModuleData,
    getSubModuleDataById,
    updateSubModuleData,
    deleteSubModuleData,
    getUserApplications
} from "../../controllers/sub_module_data";
import { upload } from '../../middleware/multer';
import passport from "passport";
const SubModuleDataRouter = Router();

SubModuleDataRouter.post("/", upload.any(), passport.authenticate('jwt', { session: false }), createSubModuleData);
SubModuleDataRouter.get("/", getUserApplications);
SubModuleDataRouter.get("/", getAllSubModuleData);
SubModuleDataRouter.get("/:id", getSubModuleDataById);
SubModuleDataRouter.put("/:id", updateSubModuleData);
SubModuleDataRouter.delete("/:id", deleteSubModuleData);

export { SubModuleDataRouter };
