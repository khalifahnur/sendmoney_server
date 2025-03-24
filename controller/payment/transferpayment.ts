import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";

const transferToMpesa = async (
  amount: number,
  fullName: string,
  phoneNumber: string
) => {
  try {
    let sanitizedPhone = phoneNumber.replace(/\s/g, "");
    if (sanitizedPhone.startsWith("+254")) {
      sanitizedPhone = "0" + sanitizedPhone.slice(4); // Convert +2547xxxxxxx → 07xxxxxxx
    }

    console.log(
      `Attempting transfer: ${amount} KES to ${fullName} (${sanitizedPhone})`
    );

    const recipientPayload = {
      type: "mobile_money",
      name: fullName,
      account_number: sanitizedPhone,
      bank_code: "MPESA",
      currency: "KES",
    };
    console.log(
      "Recipient payload:",
      JSON.stringify(recipientPayload, null, 2)
    );

    const recipientResponse = await axios.post(
      "https://api.paystack.co/transferrecipient",
      recipientPayload,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "Recipient creation response:",
      JSON.stringify(recipientResponse.data, null, 2)
    );

    if (!recipientResponse.data.status) {
      throw new Error(
        "Failed to create transfer recipient: " +
          JSON.stringify(recipientResponse.data)
      );
    }

    const recipientCode = recipientResponse.data.data.recipient_code;

    const transferResponse = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: amount * 100,
        currency: "KES",
        recipient: recipientCode,
        reason: `Payment to ${fullName}`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!transferResponse.data.status) {
      throw new Error(
        "Transfer failed: " + JSON.stringify(transferResponse.data)
      );
    }

    console.log("Transfer successful:", transferResponse.data);
    return transferResponse.data;
  } catch (error: any) {
    console.error(
      "Transfer error details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = transferToMpesa;
