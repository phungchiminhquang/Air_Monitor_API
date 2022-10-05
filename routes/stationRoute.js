import express from "express";
import * as stationController from "../controller/stationController.js";
import "datejs";

const router = express.Router();

// Send Data from harware to the server
// /api/station/sendData
router.post("/sendData", stationController.sendStationData);

// /api/station/createStation
router.post("/createStation", stationController.createStation);

router.patch("/updateStation", stationController.updateStation);

router.get("/getAllStation", stationController.getAllStation);

// get specified station information
// api/station/getStationData
router.get("/getData", (req, res) => {
  // remember to provide stationId
  res.send("This will be the data of the specified station");
});

export { router };
