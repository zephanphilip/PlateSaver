const express = require('express');
const router = express.Router();
const { sendEmailNotification, sendDonationEmailNotification } = require('../controllers/notificationController');

router.post('/send-email', sendEmailNotification);
router.post('/senddonationemail', sendDonationEmailNotification);

module.exports = router;