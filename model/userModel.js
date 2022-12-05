import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        // delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);
// userSchema.pre('findOneAndUpdate', function (next){
//   var user = this;
//   if(!user.isModified("password"))return next();

// })

// userSchema.methods.validatePassword = async function validatePassword(data) {
//   return bcrypt.compare(data, this.password);
// };
const UserModel = mongoose.model("user", userSchema);

export default UserModel;
