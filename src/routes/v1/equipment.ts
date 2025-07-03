import express from "express";
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} from "../../controllers/equipment";    
import passport from "../../routes/auth/passport";
 

const router = express.Router();

// Require JWT for all routes
router.use(passport.authenticate("jwt", { session: false }));

router.post("/",  createEquipment);
router.get("/", getAllEquipment);
router.get("/:id", getEquipmentById);
router.put("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);

export default router;
