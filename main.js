import express from "express";
import { router as userRouter } from "./routes/userRoute.js";
import { mongoose } from "mongoose";
import * as dotenv from "dotenv";
import { router as stationRouter } from "./routes/stationRoute.js";
const app = express();

//Connect to DB;
dotenv.config();

mongoose.connect(process.env.DB_CONNECT, (err) => {
  if (err) throw err;
  console.log("connected to DB");
});

//Middleware
app.use(express.json());

//import router
app.use("/api/user", userRouter);
app.use("/api/station", stationRouter);

app.listen(3000, () => {
  console.log("listening on PORT 3000");
});
