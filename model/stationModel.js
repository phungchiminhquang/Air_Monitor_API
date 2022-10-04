import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const paramSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Code: {
      type: String,
      required: true,
    },
    Unit: {
      type: String,
      required: true,
    },
    Min: {
      type: Number,
      required: true,
    },
    Max: {
      type: Number,
      required: true,
    },
    Color: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

const stationSchema = new mongoose.Schema(
  {
    Id: {
      type: String,
      required: true,
      unique: true,
      // select: 0,// could set the select to 0 to exclude it from result of query
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
    Params: {
      type: [paramSchema],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

stationSchema.plugin(uniqueValidator);
const StationModel = mongoose.model("stations", stationSchema);

export default StationModel;
