import { Router } from "express";
import {
    createRegistry,
    getAllRegistries,
    getRegistryById,
    updateRegistry,
    deleteRegistry,
} from "../../controllers/registry";
import multer from "multer";
import { uploadImage } from "../../utils/uploadImage";

const router = Router();

const upload = multer({ storage: multer.diskStorage({
  destination: (req, file, cb) => {
    const path = uploadImage(file);
    cb(null, path);
  }
})});

router.post("/", upload.single("icon"), createRegistry);
router.get("/", getAllRegistries);
router.get("/:id", getRegistryById);
router.put("/:id", upload.single("icon"), updateRegistry);
router.delete("/:id", deleteRegistry);

export default router;
