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
Object.defineProperty(exports, "__esModule", { value: true });
const transferToMpesa = require('./transferpayment');
const Admin = require('../../model/admin');
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const event = req.body;
        console.log('Received Webhook:', event);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: User ID missing' });
        }
        const adminInfo = yield Admin.findById(userId);
        if (!adminInfo) {
            return res.status(404).json({ error: 'Admin info not found' });
        }
        const fullName = `${adminInfo.firstname} ${adminInfo.lastname}`;
        const phoneNumber = adminInfo.phoneNumber;
        if (event.event === 'charge.success') {
            console.log('Payment successful:', event.data);
            const amount = event.data.amount / 100; // Convert to KES
            // Call transfer function to send funds to restaurant
            yield transferToMpesa(amount, fullName, phoneNumber);
        }
        res.sendStatus(200); // Acknowledge the webhook
    }
    catch (error) {
        console.error('Webhook handling error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = handleWebhook;
