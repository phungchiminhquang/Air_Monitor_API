import express from "express";
import * as stationController from "../controller/stationController.js";
import DataModel from "../model/dataModel.js";
import "datejs";

const router = express.Router();

// String handling to get value and name of param in data query
const handleParamString = function (paramString) {
  const paramArray = paramString.split(";");
  var result = {};
  result.ValueDoc = [];
  for (let i = 0; i < paramArray.length - 1; i++) {
    const param = paramArray[i].split("[")[0];
    console.log(i + "__" + param);
    if (param != "TimeStamp") {
      const value = parseFloat(paramArray[i].split("[")[1].slice(0, -1));
      result.ValueDoc[i] = {
        ParamName: param,
        ParamValue: value,
        ParamStatus: 0,
      };
    } else {
      // if param == "TimeStamp"
      const value = Date.parse(paramArray[i].split("[")[1].slice(0, -1));
      result.HappenedTime = value;
    }
  }
  return result;
};

// Send Data from harware to the server
// /api/station/sendData
router.post("/sendData", async (req, res) => {
  console.log(req.query);

  const stationId = req.query.stationcode;

  // split the value of param from string
  req.data = handleParamString(req.query.data);

  console.log(req.data);
  const filter = {
    _id: { $regex: stationId + "_", $options: "i" },
    count: { $lt: 1000 },
  };
  const update = {
    $push: {
      data: req.data,
    },
    $inc: { count: 1 },
    $setOnInsert: {
      stationId: stationId,
      _id: stationId + "_" + Math.round(Date.now() / 1000),
    },
  };
  try {
    const result = await DataModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
    // const result = await DataModel.findOne(filter);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }

  return res.send("this the the result from sendData");
});

// /api/station/createStation
router.post("/createStation", stationController.createStation);

router.patch("/updateStation", stationController.updateStation);

// Note must have "withValue"
router.get("/getAllStation", stationController.getAllStation);

// get specified station information
// api/station/getStationData
router.get("/getStationData", (req, res) => {
  // remember to provide stationId
  res.send("This will be the data of the specified station");
});

export { router };
