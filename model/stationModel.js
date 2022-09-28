import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const stationSchema = new mongoose.Schema(
  {
    Id: {
      type: String,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
      // unique: true,
    },
    DeviceCode: {
      type: String,
      required: true,
      // unique: true,
    },
    TelNo: {
      type: String,
      required: true,
      // unique: true,
    },
    Address: {
      type: String,
      required: true,
    },
    Latitude: {
      type: String,
      required: true,
    },
    Longitude: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "CreatedDate", updatedAt: "UpdatedDate" } }
);

stationSchema.plugin(uniqueValidator);
const StationModel = mongoose.model("stations", stationSchema);

export default StationModel;
