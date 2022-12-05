import express from "express";
import * as stationController from "../controller/stationController.js";
import "datejs";
import { verifyToken } from "./verifyToken.js";

const router = express.Router();

// /api/station/createStation
router.post("/createStation", verifyToken, stationController.createStation);
router.delete("/deleteStation", verifyToken, stationController.deleteStation);
router.patch("/updateStation", verifyToken, stationController.updateStation);
router.get("/getAllStation", verifyToken, stationController.getAllStation);

// send value from harware to the server
// /api/station/sendValue

export { router };
