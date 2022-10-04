import mongoose from "mongoose";
import "datejs";
const ValueDocSchema = new mongoose.Schema(
  {
    ParamName: String,
    ParamValue: Number,
    ParamStatus: Number,
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

const valueSchema = new mongoose.Schema(
  {
    HappenedTime: Date,
    ValueDoc: [ValueDocSchema],
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        ret.HappenedTime = ret.HappenedTime.toString("yyyy-mm-ddTHH:mm:ss"); //convert to current localTimeZone
      },
    },
  }
);
const dataSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    stationId: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    data: {
      type: [valueSchema],
    },
  },
  {
    collection: "data",
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
      },
    },
  }
);

const DataModel = mongoose.model("data", dataSchema);

export default DataModel;
