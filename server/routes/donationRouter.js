const express = require('express');

const {donation,getUserDonations, getAvailableDonations, acceptDonation} = require('../controllers/donationController');

const router = express.Router();

router.post('/',donation);
router.get('/:userId', getUserDonations);

router.get('/available/:userId', getAvailableDonations);


router.post('/:donationId/accept', acceptDonation);

module.exports = router;