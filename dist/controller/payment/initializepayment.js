"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const initiatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { phone, amount, email } = req.body;
    if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ error: 'Paystack secret key is missing' });
    }
    try {
        const response = yield axios_1.default.post('https://api.paystack.co/charge', {
            email,
            amount: amount * 100, // Convert to cents
            currency: 'KES',
            mobile_money: {
                phone,
                provider: 'mpesa',
            },
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error initiating payment:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(500).json({ error: 'Failed to initiate payment', details: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message });
    }
});
module.exports = initiatePayment;
