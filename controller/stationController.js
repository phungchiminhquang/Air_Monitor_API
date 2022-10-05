import { createStationValidation } from "../validation.js";
import StationModel from "../model/stationModel.js";
import { DataModel } from "../model/dataModel.js";

const createStation = async (req, res) => {
  // assign new station information
  const { error } = createStationValidation(req.body);
  if (error) {
    return res.status(500).json(error.details[0]);
  }

  const station = new StationModel({
    StationId: req.body.StationId,
    StationName: req.body.StationName,
    DeviceCode: req.body.DeviceCode,
    Address: req.body.Address,
    TelNo: req.body.TelNo,
    Latitude: req.body.Latitude,
    Longitude: req.body.Longitude,
    Params: req.body.Params,
  });

  try {
    const newStation = await station.save();
    return res
      .status(200)
      .json({ message: "Station successfully created", station: newStation });
  } catch (err) {
    return res.status(500).json(err);
  }
  // check if
};

const getAllStation = async (req, res) => {
  try {
    const allStation = await StationModel.find({});
    return res.status(200).json(allStation);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateStation = async (req, res) => {
  // validate the updateStation information
  // must have the id of the station included
  const stationId = req.body.StationId.trim(); //remove unwanted space from stationId string
  if (!stationId) {
    return res.status(500).json({ message: "missing the id" });
  }

  // findOneAndUpdate Station
  const filter = { StationId: stationId };
  const update = req.body;
  try {
    var doc = await StationModel.findOneAndUpdate(filter, update, {
      new: true,
    });

    return res.json(doc);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// String handling to get value and name of param in data query
const convertStringToValueModel = function (paramString) {
  const paramArray = paramString.split(";");
  var mappedValue = {};
  mappedValue.paramRecArray = [];
  for (let i = 0; i < paramArray.length - 1; i++) {
    const param = paramArray[i].split("[")[0];
    console.log(i + "__" + param);
    if (param != "TimeStamp") {
      const value = parseFloat(paramArray[i].split("[")[1].slice(0, -1));
      mappedValue.paramRecArray[i] = {
        paramName: param,
        paramValue: value,
        paramStatus: 0,
      };
    } else {
      // if param == "TimeStamp"
      const value = Date.parse(paramArray[i].split("[")[1].slice(0, -1));
      mappedValue.happenedTime = value;
    }
  }
  return mappedValue;
};
// update latest value to station
const updateStationLatestValue = async function (stationId, value) {
  const filter = { StationId: stationId };
  const update = { Value: value };
  try {
    var result = await StationModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    console.log("sucessfully update latest value_____________");
    console.log(result);
  } catch (error) {
    console.log(error);
  }
  return;
};

const sendStationData = async (req, res) => {
  const stationId = req.query.stationcode;
  // split the value of param from string
  req.value = convertStringToValueModel(req.query.data);

  const happenedTime = req.value.happenedTime;
  const filter = {
    "compositeId.stationId": stationId,
    count: { $lt: 5 },
  };
  const update = {
    $push: {
      data: req.value, //push one more value into the data array
    },
    $inc: { count: 1 },
    $setOnInsert: {
      "compositeId.firstRecTime": happenedTime,
      "compositeId.stationId": stationId,
    },
  };

  try {
    const result = await DataModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
    updateStationLatestValue(stationId, req.value);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }

  // const dataInstance = new DataModel({
  //   _id: {
  //     stationId: stationId,
  //     firstRecTime: happenedTime,
  //   },
  //   count: 1,
  //   data: [],
  // });
  // try {
  //   const result = await DataModel.findOne(filter);
  //   return res.json(result);
  // } catch (error) {
  //   return res.status(500).json(error);
  // }

  return res.send("this the the result from sendData");
};

export { createStation, getAllStation, updateStation, sendStationData };
