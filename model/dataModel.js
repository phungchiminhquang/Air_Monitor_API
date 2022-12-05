import mongoose from "mongoose";
import "datejs";
const paramSchema = new mongoose.Schema(
  {
    ParamValue: { type: Number, default: 0 },
    ParamStatus: { type: Number, default: 0 },
    Time: { type: Date, default: Date.now() },
    Unit: { type: String, default: "defautl" },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        ret.Time = ret.Time.toString("yyyy-MM-ddTHH:mm:ss");
      },
    },
  }
);

const valueSchema = new mongoose.Schema(
  {
    HappenedTime: {
      type: Date,
      default: Date.now(),
    },
    ValueDict: {
      type: Map,
      of: paramSchema,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        ret.HappenedTime = ret.HappenedTime.toString("yyyy-MM-ddTHH:mm:ss"); //convert to current localTimeZone
      },
    },
  }
);
const dataSchema = new mongoose.Schema(
  {
    compositeId: {
      stationId: {
        type: String,
      },
      firstRecTime: {
        type: Date,
        default: Date.now(),
      },
    },
    count: {
      type: Number,
      default: 1,
    },
    data: [valueSchema],
  },
  {
    collection: "data",
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        ret.compositeId.firstRecTime = ret.compositeId.firstRecTime.toString(
          "yyyy-MM-ddTHH:mm:ss"
        );
      },
    },
  }
);

const DataModel = mongoose.model("data", dataSchema);
export { DataModel };
