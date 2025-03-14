"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const InitiatePaymentController = require("../controller/payment/initializepayment");
const authenticateUser = require("../middleware/middleware");
const handleWebhook = require("../controller/payment/webhook");
router.post("/initiate-payment", InitiatePaymentController);
router.post("/paystack-web-hook", authenticateUser, handleWebhook);
module.exports = router;
