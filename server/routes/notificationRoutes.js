const express = require('express');
const router = express.Router();
const { sendEmailNotification } = require('../controllers/notificationController');

router.post('/send-email', sendEmailNotification);

module.exports = router;