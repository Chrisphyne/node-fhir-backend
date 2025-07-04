import express from "express";
import passport from "../auth/passport";
import {
  createInventoryTransaction,
  getAllInventoryTransactions,
  getInventoryTransactionById,
  updateInventoryTransaction,
  deleteInventoryTransaction,
} from "../../controllers/inventoryTransaction";

const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post("/", createInventoryTransaction);
router.get("/", getAllInventoryTransactions);
router.get("/:id", getInventoryTransactionById);
router.put("/:id", updateInventoryTransaction);
router.delete("/:id", deleteInventoryTransaction);

export default router;
