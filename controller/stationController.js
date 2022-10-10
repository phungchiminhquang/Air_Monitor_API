import { createStationValidation } from "../validation.js";
import StationModel from "../model/stationModel.js";
import { DataModel } from "../model/dataModel.js";
import { MAXIMUM_COUNT } from "./util/config.js";
import { valueDocTimeFilter, pagingFilter } from "./util/getDataHelpers.js";
import {
  convertStringToValueModel,
  updateStationLatestValue,
} from "./util/sendValueHelpers.js";

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

const sendValue = async (req, res) => {
  const stationId = req.query.stationcode;
  // split the value of param from string
  req.value = convertStringToValueModel(req.query.data);

  const happenedTime = req.value.happenedTime;
  const filter = {
    "compositeId.stationId": stationId,
    count: { $lt: MAXIMUM_COUNT },
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
};

const getData = async (req, res) => {
  // remember to provide stationId
  var query = req.query;
  console.log({
    startTime: query.startTime,
    endTime: query.endTime,
  });
  query.startTime = query.startTime == '""' ? 0 : Date.parse(query.startTime);
  query.endTime =
    query.endTime == '""' ? Date.now() : Date.parse(query.endTime);

  query.pageNum = parseInt(query.pageNum);
  query.pageSize = parseInt(query.pageSize);
  console.log({
    startTime: query.startTime,
    endTime: query.endTime,
  });

  const stationFilter = {
    stationId: query.stationId,
  };

  // filter to choose bucket documents containing at least on value is between startTime and endTime
  const bucketDocFilter = {
    "compositeId.stationId": query.stationId,
    data: {
      $elemMatch: {
        happenedTime: {
          $gte: query.startTime,
          $lte: query.endTime,
        },
      },
    },
  };

  try {
    const bucketDoc = await DataModel.find(bucketDocFilter);
    const filtedValueDoc = valueDocTimeFilter(
      bucketDoc,
      query.startTime,
      query.endTime
    );
    const filtedPaging = pagingFilter(
      filtedValueDoc,
      query.pageSize,
      query.pageNum
    );
    return res.json(filtedPaging);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getAllData = async (req, res) => {
  const filter = {
    "compositeId.stationId": req.query.stationId,
  };

  try {
    const result = await DataModel.find(filter);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export {
  createStation,
  getAllStation,
  updateStation,
  sendValue,
  getAllData,
  getData,
};
