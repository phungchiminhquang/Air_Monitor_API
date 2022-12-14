import express from "express";

import { mongoose } from "mongoose";
import * as dotenv from "dotenv";
import { router as stationRouter } from "./routes/stationRoute.js";
import { router as userRouter } from "./routes/userRoute.js";
import { router as dataRouter } from "./routes/dataRoute.js";

const app = express();

//Connect to DB;
dotenv.config();

mongoose.connect(process.env.DB_CONNECT, (err) => {
  if (err) throw err;
  console.log("connected to DB");
});

// mongoose.connect('mongodb://127.0.0.1:27017', (err) => {
//   if (err) throw err;
//   console.log("connected to DB");
// });

//Middleware
app.use(express.json());
//import router
app.use("/api/user", userRouter);
app.use("/api/station", stationRouter);
app.use("/api/data", dataRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("listening on PORT " + PORT);
});
