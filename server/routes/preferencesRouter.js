const express = require('express');

const {setPreferences} = require('../controllers/preferenceController');

const router = express.Router()


// set a preference 
router.post('/',setPreferences);

module.exports = router;
