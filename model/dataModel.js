import mongoose from "mongoose";
import "datejs";
const paramDocSchema = new mongoose.Schema(
  {
    paramName: String,
    paramValue: Number,
    paramStatus: Number,
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
    happenedTime: {
      type: Date,
      default: Date.now(),
    },
    paramDoc: [paramDocSchema],
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        ret.happenedTime = ret.happenedTime.toString("yyyy-MM-ddTHH:mm:ss"); //convert to current localTimeZone
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

export { DataModel, valueSchema };
