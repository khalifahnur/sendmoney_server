"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("./lib/SecretKeyConfig");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const port = process.env.PORT || 3002;
const MongodbConn = process.env.MONGODB_CONN || "";
const corsOptions = {
    origin: ['https://sendmoney-eta.vercel.app', 'http://localhost:3000'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "5mb" }));
app.use(body_parser_1.default.json({ limit: "5mb" }));
mongoose_1.default
    .connect(MongodbConn)
    .then(() => {
    console.log("MongoDB successfully connected");
})
    .catch((error) => {
    console.log("MongoDB connection Error", error);
});
const adminauthrouter = require("./router/admin");
const paymentrouter = require("./router/payment");
/**
 * /swiftab/auth/user/SignUp
 * /swiftab/auth/user/SignIn
 */
app.use("/sendmoney/auth/admin", adminauthrouter);
app.use("/sendmoney/payment", paymentrouter);
app
    .listen(port, () => {
    console.log(`Listening on port ${port}`);
})
    .on("error", (err) => {
    console.error("Server error:", err);
});
