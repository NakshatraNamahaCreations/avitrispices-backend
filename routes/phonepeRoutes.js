const express = require('express');
const router = express.Router();
const { initiatePayment } = require('../Controllers/phonepeController');

router.post('/initiate', initiatePayment);

module.exports = router;
