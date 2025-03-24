import express from "express";

const router = express.Router();

const InitiatePaymentController = require("../controller/payment/initializepayment");
const authenticateUser = require("../middleware/middleware");
const handleWebhook = require("../controller/payment/webhook")

router.post("/initiate-payment",authenticateUser, InitiatePaymentController);
router.post("/paystack-web-hook",handleWebhook)


module.exports = router;