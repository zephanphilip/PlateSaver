const express = require('express');

const {donation} = require('../controllers/donationController');

const router = express.Router();

router.post('/',donation);

module.exports = router;