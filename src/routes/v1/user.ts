import { Router } from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    completeProfile,
} from "../../controllers/user";
// import passport from "passport";
import { upload } from "../../middleware/multer";

const UserRouter = Router();

// User Routes
UserRouter.post("/",  createUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/complete-profile", upload.single('profile_pic'), completeProfile);
UserRouter.get("/",  getAllUsers);
UserRouter.get("/:id",  getUserById);
UserRouter.put("/:id",  updateUser);
UserRouter.delete("/:id",  deleteUser);


export default UserRouter;
