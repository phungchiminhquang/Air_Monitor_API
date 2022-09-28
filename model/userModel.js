import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 6,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

userSchema.plugin(uniqueValidator);
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
