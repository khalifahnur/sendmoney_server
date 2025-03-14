import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

const transferToMpesa = async (amount: number, fullName: string, phoneNumber: string) => {
  try {
    // Step 1: Create Mobile Money Recipient
    const recipientResponse = await axios.post(
      'https://api.paystack.co/transferrecipient',
      {
        type: 'mobile_money',
        name: fullName,
        account_number: phoneNumber,
        bank_code: 'MPESA',
        currency: 'KES',
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const recipientCode = recipientResponse.data.data.recipient_code;

    // Step 2: Initiate Transfer to Mpesa
    const transferResponse = await axios.post(
      'https://api.paystack.co/transfer',
      {
        source: 'balance',
        amount: amount * 100, // Convert to cents
        currency: 'KES',
        recipient: recipientCode,
        reason: `Payment to ${fullName}`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Transfer successful:', transferResponse.data);
  } catch (error: any) {
    console.error('Error transferring funds:', error.response?.data || error.message);
  }
};

module.exports = transferToMpesa;
