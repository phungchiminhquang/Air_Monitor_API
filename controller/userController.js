import { registerValidation, loginValidation } from "../validation.js";
import bcrypt from "bcryptjs";
import UserModel from "../model/userModel.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  // Let validate the data before we make a user
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // assgin user info
  const user = new UserModel({
    username: req.body.username,
    password: hashedPassword,
  });
  // try to save new user
  try {
    const newUser = await user.save();

    return res.status(200).json({
      message: "Successfully registered",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { error } = loginValidation(req.body);
  console.log(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  // check in if the username is correct ???
  let user = await UserModel.findOne({ username: req.body.username });
  if (!user) {
    return res.status(200).send("username is incorrect");
  }
  //Check if password is correct ???
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("password is incorrect");
  }

  // Create and assign a token, I dont set the expires time on purpose for simple cases
  const accessToken = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET);
  // I skip the refreshToken part for simplest cases
  // const refreshToken = jwt.sign(user.toJSON(), process.env.TOKEN_SECRET);

  return res.send({
    message: "success",
    accessToken: accessToken,
    expiredTime: "infinity and beyond",
    user: user,
  });
};

const getAllUser = async (req, res) => {
  try {
    const result = await UserModel.find({});

    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// submit user._id or accessToken to get this infomation in case infomation is updated
const getInfo = async (req, res) => {
  const _id = req.query._id;
  if (!_id) {
    return res.status(500).json({ error: "missing _id" });
  }

  try {
    const user = await UserModel.findById(_id);
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteUser = async (req, res) => {
  console.log("deleteUser");
  const _id = req.query._id;
  if (!_id) {
    return res.status(500).json({ error: "missing _id" });
  }

  const filter = { _id: _id };
  try {
    const user = await UserModel.deleteOne(filter);
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUser = async (req, res) => {
  const _id = req.body._id;
  if (!_id) {
    return res.status(500).json({ error: "missing _id" });
  }

  try {
    const user = await UserModel.findById(_id);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (oldPassword && newPassword) {
      // mean user want to change the password
      const validPass = await bcrypt.compare(oldPassword, user.password);
      if (!validPass) {
        return res.status(500).json("oldpassword is incorrect");
      }

      // hasing password
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // assign password
      delete req.body.oldPassword;
      delete req.body.newPassword;
      req.body.password = hashedPassword;
    }
    const result = await UserModel.findByIdAndUpdate(_id, req.body);
    return res.json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { register, login, getInfo, deleteUser, updateUser, getAllUser };
