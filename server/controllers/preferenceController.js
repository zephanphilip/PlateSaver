const Preferences = require('../models/preferencesModel');

// Get preferences
const getPreferences = async (req, res) => {
  try {
    const userId = req.params.userId;
    const preferences = await Preferences.find({ username: userId });

    if (preferences.length === 0) {
      return res.status(404).send("No records found for the user.");
    }

    res.status(200).json(preferences);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving preferences", error: err });
  }
};

// Set or update preferences
const setPreferences = async (req, res) => {
  try {
    const { id } = req.params;
    const preferences = req.body;

    console.log("Received Preferences:", preferences);

    let saveRecord;
    if (id) {
      // Update the existing preference
      saveRecord = await Preferences.findByIdAndUpdate(
        id,
        preferences,
        { new: true, upsert: true } // Upsert option ensures the document is created if not found
      );
    } else {
      // Create a new preference
      const newPreferences = new Preferences(preferences);
      saveRecord = await newPreferences.save();
    }

    res.status(200).json(saveRecord);
  } catch (error) {
    res.status(400).json({ message: "Error setting preferences", error });
  }
};

// Update preferences
const updatePreferences = async (req, res) => {
    const { id } = req.params;
    const updatedPreferences = req.body;
    
    try {
      const result = await Preferences.findByIdAndUpdate(id, updatedPreferences, { new: true });
      if (!result) {
        return res.status(404).json({ message: "Preference not found" });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error updating preferences", error });
    }
}
  

module.exports = { setPreferences, getPreferences, updatePreferences };
