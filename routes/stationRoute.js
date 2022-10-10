import express from "express";
import * as stationController from "../controller/stationController.js";
import "datejs";
import { DataModel } from "../model/dataModel.js";
import StationModel from "../model/stationModel.js";
import { MAXIMUM_COUNT, INTERVAL } from "../controller/util/config.js";

const router = express.Router();

// /api/station/createStation
router.post("/createStation", stationController.createStation);
router.delete("/deleteStation", stationController.deleteStation);
router.patch("/updateStation", stationController.updateStation);
router.get("/getAllStation", stationController.getAllStation);

// send value from harware to the server
// /api/station/sendValue
router.post("/sendValue", stationController.sendValue);
// getAllData of a station
router.get("/getAllData", stationController.getAllData);

// const computeAverageByInterval = function (valueDocArray, interval) {};

// get specified station information
// api/station/getValue
router.get("/getData", stationController.getData);

export { router };
