const mongoose = require('mongoose');

const phonepeLogSchema = new mongoose.Schema({
  transactionId: String,
  requestBody: Object,
  responseBody: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PhonePeLog', phonepeLogSchema);
