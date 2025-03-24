import axios from 'axios';
import { Response, Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

const initiatePayment = async (req: Request, res: Response) => {
  const { phone, amount, email, adminId } = req.body;

  if (!PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ error: 'Paystack secret key is missing' });
  }

  if (!adminId) {
    return res.status(400).json({ error: 'Admin ID is required for automatic transfers' });
  }

  try {
    const response = await axios.post(
      'https://api.paystack.co/charge',
      {
        email,
        amount: amount * 100, // Convert to cents
        currency: 'KES',
        mobile_money: {
          phone,
          provider: 'mpesa',
        },
        metadata: {
          adminId: adminId, // Store admin ID in metadata
          transfer_info: {
            recipient_type: 'mobile_money',
            provider: 'mpesa',
            requires_transfer: true
          }
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Error initiating payment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate payment', details: error.response?.data || error.message });
  }
};

module.exports = initiatePayment;