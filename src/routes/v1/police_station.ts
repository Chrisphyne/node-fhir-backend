import { Router } from "express";
import { createPoliceStation, 
    getAllPoliceStations, 
    getPoliceStationById,
     updatePoliceStation, 
     deletePoliceStation }
      from "../../controllers/police_station";

const PoliceStationRouter = Router();

PoliceStationRouter.post("/", createPoliceStation);
PoliceStationRouter.get("/", getAllPoliceStations);
PoliceStationRouter.get("/:id", getPoliceStationById);
PoliceStationRouter.put("/:id", updatePoliceStation);
PoliceStationRouter.delete("/:id", deletePoliceStation);

export default PoliceStationRouter;

