const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const verified = require("./verifyToken");
const notFound = require("./middleware/not-found");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 1050;
//Middlerware
app.use(express.json());

//Route midderWare
app.use("/api", authRoute);
app.use("/user", verified, userRoute);

//Middleware Error
app.use(notFound);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected Mongodb!"));

app.listen(PORT, () => console.log(`server is listening on port ${PORT}...`));
