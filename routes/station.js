import express from "express";
import { createStationValidation } from "../validation.js";
import StationModel from "../model/stationModel.js";

const router = express.Router();

const verifyStation = (req, res, next) => {
  // check if all the infomation is enough to create the new station

  next();
};

// Send Data from harware to the server
// /api/station/sendData
router.post("/sendData", (req, res) => {
  //   console.log(req.query);
  // to make a easier task for hardware
  // data that hardware send to server must be attached in url link
  // aka using req.query to get that data from hardware
  res.send("this will be the data that hardware sent to server");
});

// /api/station/createStation
// Note must have "withValue"
router.post("/createStation", async (req, res) => {
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
});

router.get("/getAll", async (req, res) => {
  try {
    const all = await StationModel.find({}, { _id: 0, __v: 0 }); //exclude _id and __v properties
    return res.status(200).json(all);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// get specified station information
// api/station/getStationData
router.get("/getStationData", verifyStation, (req, res) => {
  // remember to provide stationId
  res.send("This will be the data of the specified station");
});

router.patch("/updateStation", async (req, res) => {
  // validate the updateStation information
  // must have the id of the station included
  const Id = req.body.Id.trim();
  console.log(Id);
  if (!Id) {
    return res.status(500).json({ message: "missing the id" });
  }

  const filter = { Id: Id };
  const update = req.body;
  try {
    var doc = await StationModel.findOneAndUpdate(filter, update, {
      new: true,
      fields: { _id: 0, __v: 0 }, //exclude _id and __v
    });

    return res.json(doc);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export { router };
