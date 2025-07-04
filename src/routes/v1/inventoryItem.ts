import express from "express";
import passport from "../auth/passport";
import {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
} from "../../controllers/inventoryItem";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createInventoryItem);
router.get("/", getAllInventoryItems);
router.get("/:id", getInventoryItemById);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

export default router;
