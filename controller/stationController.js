import { createStationValidation } from "../validation.js";
import StationModel from "../model/stationModel.js";

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
  console.log(station);
  try {
    const newStation = await station.save();

    return res.json({
      message: "Station successfully created",
      station: newStation,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteStation = async (req, res) => {
  const stationId = req.query.stationId;
  if (stationId === undefined) {
    return res.status(500).send({ error: "missing Station ID" });
  }

  const filter = { StationId: stationId };

  try {
    const result = await StationModel.deleteOne(filter);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
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

export { createStation, deleteStation, getAllStation, updateStation };
