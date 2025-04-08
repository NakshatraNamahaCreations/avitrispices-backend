const axios = require('axios');
const generateXVerify = require('../utils/generateXVerify');
const PhonePeLog = require('../models/phonepeLogModel');

const apiKey = "c96092ff-77d9-43ef-ad9c-d5f1165e56c2";
const merchantId = "M22T35WQY33ZS";
const keyIndex = 1;

const endpoint = "/pg/v1/pay";
const fullUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox" + endpoint;

exports.initiatePayment = async (req, res) => {
  try {
    const requestBody = {
      merchantId,
      merchantTransactionId: `TXN_${Date.now()}`,
      amount: 10000, // ₹100
      merchantUserId: "USER123",
      redirectUrl: "https://yourdomain.com/success",
      redirectMode: "POST",
      callbackUrl: "https://yourdomain.com/callback",
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    const requestBodyStr = JSON.stringify(requestBody);
    const xVerify = generateXVerify(requestBodyStr, endpoint, apiKey);

    const headers = {
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'X-MERCHANT-ID': merchantId,
      'X-KEY-INDEX': keyIndex
    };

    const phonepeResponse = await axios.post(fullUrl, requestBody, { headers });

    // Save request + response log
    await PhonePeLog.create({
      transactionId: requestBody.merchantTransactionId,
      requestBody,
      responseBody: phonepeResponse.data
    });

    res.json(phonepeResponse.data);
  } catch (error) {
    console.error("PhonePe Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};
