import express from "express";
import * as stationController from "../controller/stationController.js";
import "datejs";
import { verifyToken } from "./verifyToken.js";
import { DataModel } from "../model/dataModel.js";
import StationModel from "../model/stationModel.js";

const router = express.Router();

// /api/station/createStation
router.post("/createStation", verifyToken, stationController.createStation);
router.delete("/deleteStation", verifyToken, stationController.deleteStation);
router.patch("/updateStation", verifyToken, stationController.updateStation);
router.get("/getAllStation", verifyToken, stationController.getAllStation);

// send value from harware to the server
// /api/station/sendValue
router.post("/sendValue", stationController.sendValue);
// getAllData of a station
router.get("/getAllData", verifyToken, stationController.getAllData);

// const computeAverageByInterval = function (valueDocArray, interval) {};

// get specified station information
// api/station/getValue
router.get("/getData", verifyToken, stationController.getData);

export { router };
