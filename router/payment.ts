import express from "express";

const router = express.Router();

const InitiatePaymentController = require("../controller/payment/initializepayment");
const authenticateUser = require("../middleware/middleware");
const handleWebhook = require("../controller/payment/webhook")

router.post("/initiate-payment", InitiatePaymentController);
router.post("/paystack-web-hook",authenticateUser,handleWebhook)


module.exports = router;