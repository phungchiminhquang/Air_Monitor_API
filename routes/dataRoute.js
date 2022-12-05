import express from "express";
import * as dataController from "../controller/dataController.js";
import "datejs";
import { verifyToken } from "./verifyToken.js";

const router = express.Router();

router.get("/sendData", dataController.sendData);
// getAllData of a station
router.get("/getAllData", verifyToken, dataController.getAllData);

// const computeAverageByInterval = function (valueDocArray, interval) {};

// get specified station information
// api/station/getValue
router.get("/getData", verifyToken, dataController.getData);

export { router };
