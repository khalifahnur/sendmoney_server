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
const transferToMpesa = (amount, fullName, phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Step 1: Create Mobile Money Recipient
        const recipientResponse = yield axios_1.default.post('https://api.paystack.co/transferrecipient', {
            type: 'mobile_money',
            name: fullName,
            account_number: phoneNumber,
            bank_code: 'MPESA',
            currency: 'KES',
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        const recipientCode = recipientResponse.data.data.recipient_code;
        // Step 2: Initiate Transfer to Mpesa
        const transferResponse = yield axios_1.default.post('https://api.paystack.co/transfer', {
            source: 'balance',
            amount: amount * 100, // Convert to cents
            currency: 'KES',
            recipient: recipientCode,
            reason: `Payment to ${fullName}`,
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Transfer successful:', transferResponse.data);
    }
    catch (error) {
        console.error('Error transferring funds:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
    }
});
module.exports = transferToMpesa;
