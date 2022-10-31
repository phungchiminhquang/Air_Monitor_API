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

// send user._id or accessToken to get this infomation in case infomation is updated
const getUserInfo = async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(500).json({ error: "missing username" });
  }

  const filter = { username: username };
  try {
    const user = await UserModel.findOne(filter);
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
  res.send("this will be the user info");
};

const deleteUser = async (req, res) => {
  console.log("this is from deleteUser");
  const username = req.query.username;
  if (!username) {
    return res.status(500).json({ error: "missing username" });
  }

  const filter = { username: username };
  try {
    const user = await UserModel.deleteOne(filter);
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUserInfo = async (req, res) => {
  console.log("Updating user info");
  const _id = req.body._id;
  if (!_id) {
    return res.status(500).json({ error: "missing _id" });
  }

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  if (oldPassword && newPassword) {
    // mean user want to change the password
  }
  const filter = { _id: _id };
  const update = req.body;
  try {
    const user = await UserModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { register, login, getUserInfo, deleteUser, updateUserInfo };
