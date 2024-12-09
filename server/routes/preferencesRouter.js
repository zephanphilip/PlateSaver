const express = require('express');
const { setPreferences, getPreferences, updatePreferences } = require('../controllers/preferenceController');

const router = express.Router();

// Get preferences for a specific user
router.get('/:userId', getPreferences);

// Create new preferences
router.post('/', setPreferences);

// Update preferences
router.put('/:id', updatePreferences);

module.exports = router;
