import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


import "./lib/SecretKeyConfig";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3002;
const MongodbConn = process.env.MONGODB_CONN || "";

const corsOptions = {
  origin: ['https://sendmoney-eta.vercel.app', 'http://localhost:3000'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser.json({ limit: "5mb" }));

mongoose
  .connect(MongodbConn)
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch((error) => {
    console.log("MongoDB connection Error", error);
  });


const adminauthrouter = require("./router/admin");
const paymentrouter = require("./router/payment")


/**
 * /swiftab/auth/user/SignUp
 * /swiftab/auth/user/SignIn
 */
app.use("/sendmoney/auth/admin", adminauthrouter);

app.use("/sendmoney/payment", paymentrouter)


app
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
  .on("error", (err: Error) => {
    console.error("Server error:", err);
  });
