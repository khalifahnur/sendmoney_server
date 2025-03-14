import { Request, Response } from 'express';

const transferToMpesa = require('./transferpayment'); 
const Admin = require('../../model/admin');

// Extend Request type to include user ID
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const handleWebhook = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const event = req.body;

    console.log('Received Webhook:', event);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID missing' });
    }

    const adminInfo = await Admin.findById(userId);
    if (!adminInfo) {
      return res.status(404).json({ error: 'Admin info not found' });
    }

    const fullName = `${adminInfo.firstname} ${adminInfo.lastname}`;
    const phoneNumber = adminInfo.phoneNumber;

    if (event.event === 'charge.success') {
      console.log('Payment successful:', event.data);

      const amount = event.data.amount / 100; // Convert to KES

      // Call transfer function to send funds to restaurant
      await transferToMpesa(amount, fullName, phoneNumber);
    }

    res.sendStatus(200); // Acknowledge the webhook
  } catch (error: any) {
    console.error('Webhook handling error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = handleWebhook;
