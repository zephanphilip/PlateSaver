const express = require('express');

const {donation,getUserDonations} = require('../controllers/donationController');

const router = express.Router();

router.post('/',donation);
router.get('/:userId', getUserDonations);

module.exports = router;