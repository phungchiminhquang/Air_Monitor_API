import { createStationValidation } from "../validation.js";
import StationModel from "../model/stationModel.js";

const createStation = async (req, res) => {
  // assign new station information
  const { error } = createStationValidation(req.body);
  if (error) {
    return res.status(500).json(error.details[0]);
  }

  const station = new StationModel({
    Id: req.body.Id,
    Name: req.body.Name,
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
  const Id = req.body.Id.trim(); //remove unwanted space from Id string
  if (!Id) {
    return res.status(500).json({ message: "missing the id" });
  }

  // findOneAndUpdate Station
  const filter = { Id: Id };
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

export { createStation, getAllStation, updateStation };
