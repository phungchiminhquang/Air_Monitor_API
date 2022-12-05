import { DataModel } from "../model/dataModel.js";
import { MAXIMUM_REC_PER_DOC } from "./util/config.js";
import {
  valueDocTimeFilter,
  valueDocAQIComputing,
  pagingFilter,
} from "./util/getDataHelpers.js";
import {
  updateStationLatestValue,
  mappingValue,
} from "./util/sendDataHelpers.js";

const sendData = async (req, res) => {
  const stationId = req.query.stationId;
  // split the value of param from string
  const value = mappingValue(req.query);

  const filter = {
    "compositeId.stationId": stationId,
    count: { $lt: MAXIMUM_REC_PER_DOC },
  };
  const update = {
    $push: {
      data: value, //push one more value into the data array
    },
    $inc: { count: 1 },
    $setOnInsert: {
      "compositeId.firstRecTime": value.HappenedTime,
      "compositeId.stationId": stationId,
    },
  };

  try {
    const result = await DataModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
    updateStationLatestValue(stationId, value);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getData = async (req, res) => {
  // remember to provide stationId
  var query = req.query;

  // put some function for interval handle here
  var interval = query.interval;
  if (interval < 5) interval = 0;
  var rollBackTime = interval * 12;

  query.startTime = query.startTime == '""' ? 0 : Date.parse(query.startTime);
  query.endTime =
    query.endTime == '""' ? Date.now() : Date.parse(query.endTime);

  var originalStartTime = new Date(query.startTime.getTime());
  var expandedStartTime = new Date(query.startTime.getTime());
  expandedStartTime.addMinutes(-rollBackTime);
  var originalEndTime = new Date(query.endTime.getTime());

  // console.log({
  //   originalStartTime: originalStartTime,
  //   expandedStartTime: expandedStartTime,
  // });
  // gap = (endTime - startTime) / 60000;
  // console.log("new gap = " + gap);
  var pageNum = parseInt(query.pageNum);
  var pageSize = parseInt(query.pageSize);
  // console.log({
  //   startTime: startTime,
  //   endTime: endTime,
  // });

  const stationFilter = {
    stationId: query.stationId,
  };

  // filter to choose bucket documents containing at least on value is between startTime and endTime
  const bucketDocFilter = {
    "compositeId.stationId": query.stationId,
    data: {
      $elemMatch: {
        HappenedTime: {
          $gte: expandedStartTime,
          $lte: originalEndTime,
        },
      },
    },
  };

  try {
    const bucketDoc = await DataModel.find(bucketDocFilter);
    const filtByTimeValue = valueDocTimeFilter(
      bucketDoc,
      originalStartTime,
      originalEndTime
    );

    const tempFiltByTimeValue = valueDocTimeFilter(
      bucketDoc,
      expandedStartTime,
      originalEndTime
    );
    valueDocAQIComputing(
      tempFiltByTimeValue,
      originalStartTime,
      originalEndTime,
      interval
    );
    const pagedValue = pagingFilter(filtByTimeValue, pageSize, pageNum);
    return res.json(pagedValue);
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

export { sendData, getAllData, getData };
