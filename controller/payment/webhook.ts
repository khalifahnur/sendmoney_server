import { Request, Response } from 'express';

const transferToMpesa = require('./transferpayment'); 
const Admin = require('../../model/admin');

const handleWebhook = async (req: Request, res: Response) => {
  try {
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));
    const event = req.body;

    if (event.event === 'charge.success') {
      const metadata = event.data.metadata;
      if (!metadata?.adminId) {
        console.error('Missing adminId in metadata:', metadata);
        return res.sendStatus(200);
      }

      const adminInfo = await Admin.findById(metadata.adminId);
      if (!adminInfo) {
        console.error('Admin not found for ID:', metadata.adminId);
        return res.sendStatus(200);
      }

      const amount = event.data.amount / 100;
      const fullName = `${adminInfo.firstname} ${adminInfo.lastname}`;
      const phoneNumber = adminInfo.phoneNumber;
      console.log("phoneNumber",phoneNumber)

      await transferToMpesa(amount, fullName, phoneNumber);
      console.log('Transfer completed successfully');
    }

    return res.sendStatus(200);
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return res.status(200).send('Webhook received with processing errors');
  }
};

module.exports = handleWebhook;
